<script>
  export let activeTab;
  export let tabs; // Array of tab names: ['info', 'request', 'response']
  export let onTabChange; // Function to call when a tab is clicked
</script>


<div role="tablist" class="tabs px-4 pt-2 tabs-lifted w-[300px]">
  {#each tabs as tabName, index}
    <input
      type="radio"
      role="tab"
      class="tab"
      aria-label={tabName.charAt(0).toUpperCase() + tabName.slice(1)}
      checked={activeTab === tabName}
      on:change={() => onTabChange(tabName)}
    />
  {/each}
</div>
