<script>
  import { activeTab } from "../lib/store/store";
  import Code from "./icons/code.svelte";
  import Extensions from "./icons/extensions.svelte";
  import Network from "./icons/network.svelte";
  import Settings from "./icons/settings.svelte";
</script>

<ul class="menu  h-full flex flex-col ">
    <!-- Top Aligned Item -->
    <li class="mb-2">
      <a on:click={() => activeTab.set('code')} class="tooltip tooltip-right {$activeTab == 'code' ? 'active' : ''}" data-tip="code">
      <Code  class="h-5 w-5" />
      </a>
    </li>

    <li class="mb-2">
      <a on:click={() => activeTab.set('extensions')} class="tooltip tooltip-right {$activeTab == 'extensions' ? 'active' : ''}" data-tip="extensions">
      <Extensions   class="h-5 w-5 font-bold" />
      </a>
    </li>

    <li class="mb-2">
      <a on:click={() => activeTab.set('network')} class="tooltip tooltip-right {$activeTab == 'network' ? 'active' : ''}" data-tip="network">
        <Network  class="h-5 w-5"/>
      </a>
    </li>

    <!-- Spacer Element -->
    <div class="flex-grow"></div>
    
    <!-- Bottom Aligned Item -->
    <li class="mb-2">
      <a on:click={() => activeTab.set('settings')} class="tooltip tooltip-right {$activeTab == 'settings' ? 'active' : ''}" data-tip="test">
      <Settings   class="h-5 w-5" />
      </a>
    </li>
</ul>
