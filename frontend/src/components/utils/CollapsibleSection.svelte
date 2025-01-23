<script>
  import Arrow from "../icons/arrow.svelte";

  export let title;
  export let initiallyOpen = true;
  let isOpen = initiallyOpen;
</script>

<div class="mb-2 bg-gray-50 dark:bg-base-300">
  <button
    class="flex items-center justify-between w-full p-2 rounded cursor-pointer focus:outline-none"
    on:click={() => (isOpen = !isOpen)}
  >
    <span class="text-sm font-medium dark:text-white">{title}</span>
    <Arrow bind:show={isOpen}/>
  </button>
  {#if isOpen}
    <div class="mt-1"> <!-- Added a small margin -->
      <slot /> <!-- Content will be slotted here -->
    </div>
  {/if}
</div>