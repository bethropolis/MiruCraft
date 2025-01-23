<script>
  // @ts-ignore
  import { FetchImage } from "../../../wailsjs/go/main/App";
  import { DB, extensionDB } from "../../lib/db/db";
  import { createEventDispatcher } from "svelte";
  import Download from "../icons/download.svelte";
  import { exportExtension } from "../../lib/utils/export";
  import Bracket from "../icons/bracket.svelte";
  import Remove from "../icons/remove.svelte";
  import Save from "../icons/save.svelte";
  import Ghost from "../icons/ghost.svelte";

  /**
   * @typedef {import('../../lib/types/index').Extension} Extension
   */

  const dispatch = createEventDispatcher();

  /**
   * @type {Extension}
   */
  export let extension;
  export let save = false;
  export let remove = false;
  export let load = false;

  let imagePromise;



  // Preload the image with caching logic
  const preloadImage = async (url) => {
  try {
    const response = await FetchImage(url);
    return `data:${response.mimeType};base64,${response.data}`;
  } catch (error) {
    console.error("Image failed to load:", error);
    throw error;
  }
};

  // Trigger preload when the component is initialized
  $: imagePromise = preloadImage(extension.icon);

  const handleRemove = async () => {
    await extensionDB.deleteExtension(extension.package);
    updated();
  };

  const handleSave = async () => {
    await extensionDB.addExtension(extension);
    updated();
  };

  const handleLoad = async () => {
    if(DB.get("current")) await extensionDB.addExtension(DB.get("current"));
    DB.set("current", extension);
    DB.set("code", extension.script);
    updated();
  };

  const exportFile = async () => {
    let filename = extension.package + ".js";
    await exportExtension(filename, extension.script);
  };

  const updated = () => {
    dispatch("updated");
  };
</script>

<div class="card bg-base-100">
  <div class="card-body flex-row p-2">
    <div class="h-10 w-10 mr-2 rounded-full overflow-hidden object-center">
      {#await imagePromise}
        <!-- Skeleton loader -->
        <div class="skeleton h-full w-full"></div>
      {:then imageSrc}
        <img
          src={imageSrc}
          alt={extension.name}
          class="h-full w-full rounded-full object-cover"
        />
      {:catch}
        <!-- Default fallback in case of failure -->
        <Ghost class="h-full w-full" />
      {/await}
    </div>
    <div class="flex flex-col">
      <span>{extension.name}</span>
      <span class="text-xs"
        >{extension.package}
        <i class="text-base text-gray-500">.</i>
        <span class="text-primary">{extension.type}</span></span
      >
    </div>
    <div class="flex-grow"></div>
    <div class="flex gap-3">
      {#if load}
        <div class="tooltip" data-tip="load extension">
          <button
            class="btn btn-square btn-outline btn-primary"
            on:click={handleLoad}
          >
            <Bracket />
          </button>
        </div>
      {/if}
      {#if save}
        <div class="tooltip" data-tip="save extension">
          <button
            class="btn btn-square btn-outline btn-secondary"
            on:click={handleSave}
          >
            <Save />
          </button>
        </div>
      {/if}

      {#if remove}
        <div class="tooltip" data-tip="download extension">
          <button class="btn btn-square btn-outline btn-accent" on:click={exportFile}>
            <Download />
          </button>
        </div>

        <div class="tooltip" data-tip="remove extension">
          <button
            class="btn btn-square btn-outline btn-error"
            on:click={handleRemove}
          >
            <Remove />
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
