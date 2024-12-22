<script>
  import {
    downloadExtension,
    getUpstreamExtensions,
    isExtensionInstalled,
  } from "../../lib/utils/getUpstreamExtensions";
  import { createEventDispatcher, onMount } from "svelte";
  import Close from "../icons/close.svelte";
  import Download from "../icons/download.svelte";

  /**
   * @typedef {import('../../lib/types/index').Extension} Extension
   */

  const dispatch = createEventDispatcher();

  /** @type {Extension[]} */
  let extensions = [];

  export let showModal = false;

  // Function to fetch extensions on mount
  onMount(async () => {
    try {
      /** @type {Extension[]} */
      extensions = await getUpstreamExtensions();
    } catch (error) {
      console.error("Error fetching extensions:", error);
    }
  });

  // Function to handle install action
  async function installExtension(extensionUrl) {
    await downloadExtension(extensionUrl);
    dispatch("extensionInstalled");
  }

  function handleClick(event) {
    showModal = false;
  }

  let searchQuery = "";

  $: filteredExtensions = extensions.filter((extension) =>
    extension.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<dialog id="extensionWarehouse" class="modal modal-center modal-open">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold uppercase">Install Extension</h3>
      <button class="btn btn-sm btn-circle bg-base-100" on:click={handleClick}>
        <Close />
      </button>
    </div>
    <input
      type="text"
      placeholder="Search extensions..."
      class="input input-bordered w-full mb-4"
      bind:value={searchQuery}
    />
    <ul class="menu menu-lg rounded-box space-y-2">
      {#each filteredExtensions as extension}
        <li
          class="flex flex-row items-center p-2 rounded-lg shadow-sm transition"
        >
          {#if extension.icon}
            <img
              src={extension.icon}
              class="w-10 h-10 object-contain p-0 rounded-full overflow-hidden mr-4"
              alt="{extension.name} icon"
              loading="lazy"
            />
          {:else}
            <div
              class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full mr-4"
            >
              <span class="text-sm text-gray-500">No Icon</span>
            </div>
          {/if}
          <span class="flex-grow items-center hover:bg-base-100"
            >{extension.name}</span
          >
          {#await isExtensionInstalled(extension.package)}

            {:then isInstalled}
              {#if !isInstalled}
              <button
              class="btn btn-square btn-outline btn-primary flex p-1 items-center justify-center"
              on:click={() => installExtension(extension.url)}>
                  <Download   />
              </button>
            {/if}
        {/await}
        </li>
      {/each}
    </ul>
  </div>
  <label class="modal-backdrop" for="extensionWarehouse" on:click={handleClick}
  ></label>
</dialog>
