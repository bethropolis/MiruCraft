<script>
  import Editor from "./components/editor/editor.svelte";
  import ExtensionManager from "./components/extensions/extensionManager.svelte";
  import JsonHeader from "./components/json/jsonHeader.svelte";
  import Network from "./components/network/network.svelte";
  import NetworkInfo from "./components/network/networkInfo.svelte";
  import Info from "./components/settings/info.svelte";
  import Settings from "./components/settings/settings.svelte";
  import Layout from "./layout.svelte";
  import { activeTab } from "./lib/store/store.js";


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
        return {
          left: "max-w-[calc(25%-2rem)]",
          right: "max-w-[calc(75%-2rem)]",
        };
      default:
        return {
          left: "max-w-[calc(50%-2rem)]",
          right: "max-w-[calc(50%-2rem)]",
        };
    }
  })();
</script>

<Layout>
  <div
    class="flex-1 {sideWidths.left} min-w-56 border-r border-gray-300 overflow-hidden"
  >
    <svelte:component this={getActiveComponent()} />
  </div>
  <div class="flex-1 py-4 pl-4 {sideWidths.right}">
    {#if $activeTab === "settings"}
      <Info />
    {:else if $activeTab === "network"}
      <NetworkInfo />
    {:else}
      <JsonHeader/>
    {/if}
  </div>
</Layout>
