<script>
    export let options = [];
    export let placeholder = "Select an option..."; 
  
    export let selectedOption = ""; 
  
    function handleSelect(event) {
      selectedOption = event.target.value;
    }
  </script>
  
  <div class="relative w-full max-w-sm">
    <input
      list="dropdown-options"
      bind:value={selectedOption}
      placeholder={placeholder}
      class="w-ful"
      on:input={handleSelect}
    />

    <datalist id="dropdown-options" class="w-full  bg-white border border-gray-300 rounded-md shadow-sm">
      {#each options as option}
        <option value={option} class="px-3 py-2 hover:bg-gray-100" />
      {/each}
    </datalist>
  </div>
  
  <style>
    /* Minimal additional styling, handled by Tailwind */
  </style>
  