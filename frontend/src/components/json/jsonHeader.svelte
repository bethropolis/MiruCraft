<script>
  import { trigerAlert, triggerErrorAlert } from "../../lib/utils/alert.js";
  import { code, jsonStore, manager } from "../../lib/store/store.js";
  import JsonEditorPane from "./JsonEditorPane.svelte";
  import Terminal from "../terminal/terminal.svelte";
  import Modal from "../utils/modal.svelte";
  import DropdownInput from "../utils/dropdownInput.svelte";
  import Globe from "../icons/globe.svelte";
  import Search from "../icons/search.svelte";
  import { DB, sessionDB } from '../../lib/db/db.js';
  import { patchConsole, restoreConsole } from "../../lib/utils/logger-override.js";

  let page = 1;
  let showModal = false;
  let activeTab = DB.get("jsonViewTab") || "result";
  let tabs = ["result", "console"];
  let modalType = "detail";
  let searchQuery = "";
  let detailUrl = sessionDB.getItem("detailUrl") || "";
  let detailList = [];
  let watchUrl = sessionDB.getItem("watchUrl") || "";
  let watchList = [];

  let currentlyRunning = false; 

  function changeActiveTab(tab) {
    activeTab = tab;
    DB.set("jsonViewTab", tab);
  }


  async function loadExtension() {
    try {
      await $manager.loadExtension($code);
      trigerAlert("success", "Extension loaded successfully", 1000);
    } catch (error) {
      await triggerErrorAlert(`Error: ${error.message}`);
      console.error(error);
    }
  }

  async function callLatest() {
    try {
      beforeRun();
      detailList = [];
      await loadExtension();
      const res = await $manager.latest(page);
      $jsonStore = JSON.stringify(res, null, 2);

      res.map((item) => {
        detailList.push(item.url);
      });
    } catch (error) {
      console.error(error);
      await triggerErrorAlert(`Error: ${error.message}`);
    } finally {
      currentlyRunning = false;
      restoreConsole();
    }
  }

  async function callDetail() {
    try {
      beforeRun();
      watchList = [];
      await loadExtension();
      const res = await $manager.detail(detailUrl);
      $jsonStore = JSON.stringify(res, null, 2);

      const newUrls = res.episodes.flatMap((item) => item.urls);
      watchList = newUrls.map((item) => item.url);
    } catch (error) {
      console.error(error);
      await triggerErrorAlert(`Error: ${error.message}`);
    } finally {
      currentlyRunning = false;
      restoreConsole();
    }
  }

  async function callSearch() {
    try {
      beforeRun();
      detailList = [];
      await loadExtension();
      const res = await $manager.search(searchQuery);
      $jsonStore = JSON.stringify(res, null, 2);

      res.map((item) => {
        detailList.push(item.url);
      });
    } catch (error) {
      console.error(error);
      await triggerErrorAlert(`Error: ${error.message}`);
    } finally {
      currentlyRunning = false;
      restoreConsole();
    }
  }

  async function callWatch() {
    try {
      beforeRun();
      await loadExtension();
      const res = await $manager.watch(watchUrl);
      $jsonStore = JSON.stringify(res, null, 2);
    } catch (error) {
      console.error(error);
      await triggerErrorAlert(`Error: ${error.message}`);
    } finally {
      currentlyRunning = false;
      restoreConsole();
    }
  }

  function beforeRun() {
    showModal = false;
    currentlyRunning = true;
    patchConsole();
  }

  async function preDetail() {
    modalType = "detail";
    showModal = true;
  }

  async function preWatch() {
    modalType = "watch";
    showModal = true;
  }

  async function preSearch() {
    modalType = "search";
    showModal = true;
  }
</script>

<Modal bind:showModal title={modalType} content="fill out the needed info">
  {#if modalType === "detail"}
    <div class="p-4 flex items-center gap-2">
      <label
        for="detailUrl"
        class="input input-bordered flex-grow flex items-center gap-2"
      >
        <DropdownInput
          placeholder="enter or Select a detail url..."
          bind:options={detailList}
          bind:selectedOption={detailUrl}
          on:change={() => {
            sessionStorage.setItem("detailUrl", detailUrl);
          }}
        />
        <Globe />
      </label>

      <button
        class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded"
        on:click={callDetail}>Submit</button
      >
    </div>
  {/if}
  {#if modalType === "watch"}
    <div class="p-4 flex items-center gap-2">
      <label
        for="watchUrl"
        class="input input-bordered flex-grow flex items-center gap-2"
      >
        <DropdownInput
          placeholder="enter or Select a watch url..."
          bind:options={watchList}
          bind:selectedOption={watchUrl}
          on:change={() => {
            sessionStorage.setItem("watchUrl", watchUrl);
          }}
        />
        <Globe />
      </label>

      <button
        class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded"
        on:click={callWatch}>Submit</button
      >
    </div>
  {/if}
  {#if modalType === "search"}
    <div class="p-4 flex items-center gap-2">
      <label
        for="searchQuery"
        class="input input-bordered flex-grow flex items-center gap-2"
      >
        <input
          id="searchQuery"
          type="text"
          placeholder="Enter search query..."
          bind:value={searchQuery}
          class="grow"
        />
        <Search />
      </label>

      <button
        class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded"
        on:click={callSearch}>Submit</button
      >
    </div>
  {/if}
</Modal>

<div class="flex px-2 h-[48px] pb-2 justify-between items-center">
    <div role="tablist" class="tabs m-0 w-[200px] tabs-boxed bg-base-200">
      <button
        role="tab"
        class={`tab text-sm -mb-px ${
          activeTab === "result" ? "shadow-md bg-base-100 dark:bg-neutral" : ""
        }`}
        on:click={() => changeActiveTab("result")}
      >
        Result
      </button>
      <button
        role="tab"
        class={`tab text-sm -mb-px ${
          activeTab === "console" ? "shadow-md bg-base-100 dark:bg-neutral" : ""
        }`}
        on:click={() => changeActiveTab("console")}
      >
        Console
      </button>
    </div>

  <div class="buttons">
    <button
      class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded-sm"
      class:btn-disabled={currentlyRunning}
      on:click={callLatest}>Latest</button
    >
    <button
      class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded-sm"
      class:btn-disabled={currentlyRunning}
      on:click={preDetail}>Detail</button
    >
    <button
      class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded-sm"
      class:btn-disabled={currentlyRunning}
      on:click={preSearch}>Search</button
    >
    <button
      class="btn btn-sm bg-primary hover:bg-secondary text-white font-bold rounded-sm"
      class:btn-disabled={currentlyRunning}
      on:click={preWatch}>Watch</button
    >
  </div>
</div>


{#if activeTab === "result"}
  <JsonEditorPane />
{:else if activeTab === "console"}
   <div style="height: calc(100dvh - 1rem - 48px);">
  <Terminal />

   </div>
{/if}