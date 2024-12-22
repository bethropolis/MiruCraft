<script>
  import miruCraft from "../../assets/images/mirucraft.png";
  import { BrowserOpenURL } from "../../../wailsjs/runtime/runtime";

  function OpenUrl(e) {
    e.preventDefault();
    BrowserOpenURL(e.target.href);
  }
</script>

<main class="flex flex-col h-full">
  <div class="w-full h-[70vh] grid place-items-center">
    <div>
      <img
        src={miruCraft}
        alt="MiruCraft"
        class="w-40 h-40 object-contain rounded-full"
      />
      <button
        class="btn-sm w-36 h-8 mt-4 font-sans font-medium rounded-full bg-primary text-white hover:opacity-75 focus:scale-95"
        >Github</button
      >
    </div>
  </div>

  <div class="flex-grow"></div>

  <div class="other w-full mt-16">
    <h2 class=" text-gray-400 uppercase">Other Links</h2>

    <ul>
      <li>
        <a href="https://miru.js.org" on:click={OpenUrl}>Official Miru repo</a>
      </li>
      <li>
        <a href="" on:click={OpenUrl}>Official Miru extension warehouse</a>
      </li>
      <li><a href="" on:click={OpenUrl}>Miru extension documentation</a></li>
    </ul>
  </div>
</main>

<style>
  ul {
    line-height: 1.5;
  }
  ul li a {
    @apply text-secondary;
  }
</style>
