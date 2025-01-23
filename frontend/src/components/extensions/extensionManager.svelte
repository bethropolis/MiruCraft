<script>
  import Extension from "./extension.svelte";
  import { extensionDB } from "../../lib/db/db";
  import { DB } from "../../lib/db/local";
  import { verExtensionMateData } from "../../lib/utils/extension";
  import { code } from "../../lib/store/store";
  import { importExtension } from "../../lib/utils/import";
  import { triggerErrorAlert } from "../../lib/utils/alert";
  import ExtensionInstall from "./extensionInstall.svelte";
  import Search from "../icons/search.svelte";
  import Upload from "../icons/upload.svelte";

  /*
   * @typedef {import('../lib/types/index').Extension} Extension
   */

  /*
   * @type {Extension}
   */

  let showModal = false;

  let current = DB.get("current");

  let extensionsPromise = fetchExtensions();

  async function fetchExtensions() {
    return extensionDB.getAllExtensions();
  }

  /**
   * Reference to the file upload input element.
   * This will be used to handle file uploads within the component.
   * @type {HTMLInputElement}
   */
  let fileUpload;

  /**
   * Handles updates to the current extension and refreshes the list of saved extensions.
   * It also updates the code store with the current extension's script.
   *
   * @returns {Promise<void>}
   */
  async function handleUpdate() {
    current = DB.get("current");
    extensionsPromise = fetchExtensions();
    $code = current.script;
  }

  function handleFileUpload() {
    fileUpload.click();
  }

  /**
   * Handles the file input change event, triggering the import of the selected extension file.
   * If the import is successful, it updates the extension manager.
   * If the import fails, it triggers an error alert.
   *
   * @param {Event} event - The file input change event.
   * @returns {Promise<void>} - A promise that resolves when the file handling is complete.
   */
  async function handleFileChange(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (!input.files || !input.files[0]) return;

    let importStatus = await importExtension(input.files[0]);
    if (importStatus) {
      await handleUpdate();
    } else {
      triggerErrorAlert("Error: Invalid extension file");
    }
  }

  function toggleModal() {
    showModal = !showModal;
  }
</script>

{#if showModal}
  <ExtensionInstall bind:showModal on:extensionInstalled={handleUpdate} />
{/if}

<main class="flex flex-col h-screen overflow-hidden">
  <div class="nav flex mb-4">
    <h2 class="flex uppercase items-center">Extension Manager</h2>
    <div class="flex-grow"></div>
    <div class="group flex gap-4">
      <div class="tooltip tooltip-left" data-tip="Search for extensions">
        <button class="btn btn-sm bg-base-100 shadow-none border-none" on:click={toggleModal}>
          <Search />
        </button>
      </div>
      <div class="tooltip tooltip-left" data-tip="Upload a new extension">
        <button class="btn btn-sm bg-base-100 shadow-none border-none" on:click={handleFileUpload}>
          <Upload />
        </button>
      </div>
    </div>
  </div>

  <div class="current">
    <h3 class="uppercase p-2 mb-3">Current</h3>
    {#if current && verExtensionMateData(current)}
      <Extension extension={current} save={true} on:updated={handleUpdate} />
    {:else}
      <p>No current extension found</p>
    {/if}
  </div>

  <div class="saved flex flex-col flex-grow overflow-y-auto overflow-x-hidden"> 
    <h3 class="uppercase p-2 mb-3 sticky top-0 bg-base-100 z-10">Saved</h3> 
    <div class="extensions-list flex-grow"> 
      {#await extensionsPromise}
        <div class="w-full flex justify-center">
          <span class="loading loading-dots loading-md"></span>
        </div>
      {:then extensions}
        {#if extensions.length > 0}
          {#each extensions as extension}
            <Extension
              {extension}
              load={current && current.package !== extension.package || !current}
              remove={true}
              on:updated={handleUpdate}
            />
          {/each}
        {:else}
          <p>No saved extensions found</p>
        {/if}
      {:catch error}
        <p>{error.message}</p>
      {/await}
    </div>
  </div>

  <input
    type="file"
    class="hidden"
    bind:this={fileUpload}
    on:change={handleFileChange}
  />
</main>