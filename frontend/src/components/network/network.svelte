<script>
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import { networkDB } from "../../lib/db/db";
  import Clock from "../icons/clock.svelte";
  import NetworkItem from "./networkItem.svelte";
  import Trash from "../icons/remove.svelte";
  import { eventStore } from "../../lib/store/store";
  import Modal from "../utils/modal.svelte";

  let Requests = networkDB.getAllRequests();

  let availableExtensions = networkDB.getListOfExtensions();

  let askToClear = false;

  function handleSelectedRequest(id) {
    eventStore.set({ type: "selectedRequest", data: id });
  }

   function filterRequests(extension) {
    if (extension === "all") {
      Requests = networkDB.getAllRequests();
    } else {
      Requests = networkDB.getRequestsByExtension(extension);
    }
  }

  function clear() {
    networkDB.clearRequests();
    Requests = networkDB.getAllRequests();
    handleSelectedRequest(null);
    askToClear = false;
  }


  function handleChange(event) {
    const selectElement = event.target;
    filterRequests(selectElement.value);
  }
</script>

<Modal
  bind:showModal={askToClear}
  content="Are you sure you want to clear all requests?"
  title="Clear Requests"
>
  <div class="flex justify-end gap-2">
    <button
      class="px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      on:click={() => (askToClear = false)}
    >
      Cancel
    </button>
    <button
      class="px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      on:click={clear}
    >
      Clear
    </button>
  </div>
</Modal>

<div class="h-screen w-full flex">
  <div class="w-full flex-1 flex flex-col min-h-0">
    <div class="p-3 border-b flex justify-between items-center shadow-sm">
      <div class="flex gap-2">
        <select class="select select-bordered select-sm text-sm bg-primary text-white w-full max-w-[150px]" on:change={handleChange}>
          <option value={"all"} selected>All Extensions</option>
          {#await availableExtensions then extensions}
            {#if extensions.length !== 0}
              {#each extensions as ext}
                <option value={ext}>{ext}</option>
              {/each}
            {/if}
          {/await}
        </select>
        <button
          class="px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-1"
          on:click={() => (askToClear = true)}
        >
          <Trash class="w-4 h-4" />
          <span class="text-xs hidden md:block">Clear</span>
        </button>
      </div>
      <div
        class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
      >
        <Clock class="w-4 h-4" />
        <span class="text-xs hidden md:block">Live</span>
      </div>
    </div>

    <div class="flex-1 flex min-h-0 overflow-hidden">
      <div
        class="w-full border-r border-gray-200 dark:border-neutral-700 flex flex-col"
      >
        <div class="overflow-auto flex-1 py-2 space-y-1 w-full">
          {#await Requests}
            <div class="text-center p-4 text-gray-500 dark:text-gray-400">
              Fetching Requests...
            </div>
          {:then reqs}
            {#if reqs.length === 0}
              <div class="text-center p-4 text-gray-500 dark:text-gray-400">
                No requests yet.
              </div>
            {:else}
              <VirtualList items={reqs} let:item>
                <NetworkItem
                  request={item}
                  setSelectedRequest={handleSelectedRequest}
                />
              </VirtualList>
            {/if}
          {/await}
        </div>
      </div>
    </div>
  </div>
</div>
