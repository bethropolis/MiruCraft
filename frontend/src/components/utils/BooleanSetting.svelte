<script>
    export let id = "";
    export let name = "";
    export let label = "";
    export let value = false;
    export let disabled = false;
  </script>
  
  <div class="flex items-center">
    <input 
      type="checkbox" 
      id={id}
      name={name}
      bind:checked={value}
      {disabled}
      class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
    />
    <label for={id} class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
  </div>
  