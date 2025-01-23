<script>
  export let headers = {}; // Expects a headers object
</script>

<pre class="pre-style ">
    {#each Object.entries(headers) as [header, value]}
    <div class="flex">
            <span class="header-style">{header}:</span>
            <span>{value}</span>
        </div>
  {/each}
</pre>

<style>
  .pre-style {
    @apply text-xs font-mono p-3 rounded overflow-auto;
  }
  .header-style {
    @apply font-bold text-gray-700 mr-2;
  }
</style>
