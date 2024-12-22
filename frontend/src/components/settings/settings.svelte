<script>
  import { DB } from "../../lib/db/local";
import { config } from "../../lib/store/store";


const UpdateSettings = () =>{
    DB.update("config", $config);
}
</script>

<main class="p-4 mx-2">
    <h2 class="font-bold text-lg font-sans">Settings</h2>

    <form action="#" class="p-4 ">
        <div class="form-input mb-4">
            <label for="extensionRepo" class="block text-sm font-medium text-gray-600">Extension Repository</label>
            <input type="text" id="extensionRepo" name="extensionRepo" bind:value={$config.repo} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter repository URL" on:change={UpdateSettings}>
        </div>
        <div class="form-input mb-4">
            <label for="theme" class="block text-sm font-medium text-gray-600">Theme</label>
            <select id="theme" name="theme" bind:value={$config.theme} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" on:change={UpdateSettings}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
        </div>
        <div class="form-input mb-4">
            <label for="userAgent" class="block text-sm font-medium text-gray-600">User Agent</label>
            <input type="text" id="userAgent" name="userAgent" bind:value={$config.default_headers["User-Agent"]} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter User Agent" on:change={UpdateSettings}>
        </div>
    </form>
</main>