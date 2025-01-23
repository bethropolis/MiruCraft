<script>
  import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";

    export let label;
    export let value;
    export let isUrl = false;


    function openUrl() {
        BrowserOpenURL(value);
    }
  </script>
  
  <div class="text-sm mb-1 dark:text-white">
    <span class="text-gray-500 dark:text-neutral-400">{label}:</span>
    {#if isUrl}
    <span class="text-primary cursor-pointer" on:click={openUrl} on:keydown={openUrl} tabindex="-1">{value}</span> 
    {:else }
    <span>{value}</span>
    {/if}
  </div>