<script>
  import { activeTab, manager } from "./lib/store/store.js";
  import Editor from "./components/editor/editor.svelte";
  import ExtensionManager from "./components/extensions/extensionManager.svelte";
  import JsonHeader from "./components/json/jsonHeader.svelte";
  import JsonEditorPane from "./components/json/JsonEditorPane.svelte";
  import Settings from "./components/settings/settings.svelte";
  import Info from "./components/settings/info.svelte";
  import Layout from "./layout.svelte";
  import NetworkInfo from "./components/network/networkInfo.svelte";
  import Network from "./components/network/network.svelte";


  function getActiveComponent() {
    switch ($activeTab) {
      case "code":
        return Editor;
      case "extensions":
        return ExtensionManager;
      case "settings":
        return Settings;
      case "network":
        return Network;
      default:
        return null; 
    }
  }

  $: sideWidths = (() => {
    switch ($activeTab) {
      case "network":
        return { left: "max-w-[calc(25%-2rem)]", right: "max-w-[calc(75%-2rem)]" };
      default:
        return { left:  "max-w-[calc(50%-2rem)]", right:  "max-w-[calc(50%-2rem)]" };
    }
  })();

</script>

<Layout>
  <div class="flex-1 {sideWidths.left} min-w-56 border-r border-gray-300 overflow-hidden">
    <svelte:component this={getActiveComponent()} /> 
  </div>
  <div class="flex-1 py-4 pl-4 {sideWidths.right}">
    {#if $activeTab === "settings"}
      <Info />
    {:else if $activeTab === "network"}
     <NetworkInfo/>
    {:else}
      <JsonHeader />
      <JsonEditorPane />
    {/if}
  </div>
</Layout>