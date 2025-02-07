<script>
  import Sidebar from "./components/Sidebar.svelte";
  import Alert from "./components/utils/alert.svelte";
  import { config } from "./lib/store/store";
  import {changeTheme} from"./lib/utils/theme.js";
  import "./lib/utils/json-override.js";



$: $config.theme == "dark" ? changeTheme("dracula") : changeTheme($config.theme);
</script>

<main class="flex h-screen">
  <aside class="w-16 border-r dark:border-none dark:bg-neutral">
    <Sidebar />
  </aside>

  <slot />
</main>

<Alert />
