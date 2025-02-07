<script>
  import ResponsePreview from "./ResponsePreview.svelte";
  import CollapsibleSection from "./../utils/CollapsibleSection.svelte";
  import TabButtons from "./../utils/TabButtons.svelte";
  import { onMount } from "svelte";
  import { DB, networkDB } from "./../../lib/db/db";
  import InfoItem from "./InfoItem.svelte";
  import { triggerErrorAlert } from "../../lib/utils/alert";
  import HeaderDisplay from "./HeaderDisplay.svelte";
  import { eventStore } from "./../../lib/store/store";

  /**
   * @typedef {import("../../lib/db/table/network").NetworkRequest} NetworkRequest
   */

  let activeTab = DB.get("networkInfoTab") || "info";

  /** @type {NetworkRequest} */
  let request = null; 

  const tabs = ["info", "headers", "response"]; // Define tabs array

  async function loadRequest(id) {
    try {
      if (id) {
        request = await networkDB.getRequestById(id);
      } else {
        request = await networkDB.getLastRequest();
      }
    } catch (error) {
      triggerErrorAlert(error.message);
    }
  }

  onMount(loadRequest);


  $: if($eventStore && $eventStore.type === "selectedRequest") {
    loadRequest($eventStore.data);
  } 

  function handleTabChange(tabName) {
    activeTab = tabName;
    DB.set("networkInfoTab", tabName);
  }
</script>

<div class="flex-1 flex flex-col h-full">
  <TabButtons {tabs} {activeTab} onTabChange={handleTabChange} />

  {#if request}
    {#if activeTab === "info"}
      <div class="flex-1 overflow-auto p-4 m-0">
        <div class="space-y-1 mb-4">
          <!-- Removed text-sm, moved to InfoItem -->
          <InfoItem label="Extension" value={request.extension} />
          <InfoItem label="URL" value={request.url} isUrl={true} />
          <InfoItem label="Method" value={request.method} />
          <InfoItem label="Status" value={request.status} />
          <InfoItem
            label="Time"
            value={new Date(request.time).toLocaleString()}
          />
          <InfoItem label="Duration" value={request.duration} />
        </div>
      </div>
    {:else if activeTab === "headers"}
      <div class="flex-1 overflow-auto p-4 m-0">
        <CollapsibleSection title="Request Headers">
          <HeaderDisplay headers={request.headers.request} />
        </CollapsibleSection>

        <CollapsibleSection title="Response Headers">
          <HeaderDisplay headers={request.headers.response} />
        </CollapsibleSection>

        {#if request.request.body}
          <CollapsibleSection title="Request Data">
            <pre
              class="text-xs font-mono bg-gray-50 dark:bg-neutral-800 p-3 rounded overflow-auto whitespace-pre-wrap"
              >{request.request.body}</pre>
          </CollapsibleSection>
        {/if}
      </div>
    {:else if activeTab === "response"}
      <ResponsePreview
        responseBody={request.response.body}
        contentType={request.response.headers["Content-Type"]}
      />
    {/if}
  {:else}
    <div
      class="flex-1 overflow-auto p-4 m-0 text-center text-gray-500 dark:text-neutral-400"
    >
      Loading request details...
    </div>
  {/if}
</div>

<style>
  /* Add any specific styles here if needed */
</style>
