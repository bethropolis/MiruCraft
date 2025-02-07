<script>
  // @ts-ignore
  import CodeMirror from "svelte-codemirror-editor";
  import { JsonView } from "@zerodevx/svelte-json-view";
  import { html } from "@codemirror/lang-html";
  import { editorTheme } from "../../lib/editor/editorTheme";
  import { DB } from "../../lib/db/local";



  export let responseBody;
  export let contentType;
  let activePreviewTab = DB.get("activePreviewTab") || "preview";

  function isJSON(type) {
    return (
      type &&
      (type.includes("application/json") ||
        type.includes("application/json; charset=utf-8"))
    );
  }

  function isHTML(type) {
    return type && type.includes("text/html");
  }

  function isImage(type) {
    return type && type.startsWith("image/");
  }

  function isText(type) {
    return (
      (type && type.startsWith("text/")) ||
      type === "application/xml" ||
      type === "application/javascript"
    );
  }

 
  function updateActiveTab(tab) {
    activePreviewTab = tab;
    DB.set("activePreviewTab", tab);
  }
  
</script>

<div class="flex-1 flex flex-col pt-3 gap-2">
  <div role="tablist" class="tabs m-0 w-[200px] tabs-boxed bg-base-200">
    <button
      role="tab"
      class={`tab text-sm -mb-px  ${
        activePreviewTab === "preview"
          ? "shadow-md bg-base-100 dark:bg-neutral"
          : ""
      }`}
      on:click={() => (updateActiveTab("preview"))}
    >
      Preview
    </button>
    <button
      role="tab"
      class={`tab text-sm -mb-px  ${
        activePreviewTab === "raw"
          ? "shadow-md bg-base-100 dark:bg-neutral"
          : ""
      }`}
      on:click={() => (updateActiveTab("raw"))}
    >
      Raw
    </button>
  </div>

  <div class="flex-1 overflow-auto mt-2">
    {#if activePreviewTab === "preview"}
      {#if isJSON(contentType)}
        <div class="wrap">
          <JsonView json={JSON.parse(responseBody || "{}")} />
        </div>
      {:else if isHTML(contentType)}
        <iframe
          title="preview"
          srcdoc={responseBody || ""}
          sandbox="allow-same-origin"
          class="w-full h-full border-none"
          loading="lazy"
        ></iframe>
      {:else if isImage(contentType)}
        <img
          src="data:{contentType};base64,{btoa(responseBody)}"
          alt="img preview"
          class="max-w-full max-h-full"
        />
      {:else if isText(contentType)}
        <pre
          class="text-xs font-mono bg-gray-50 dark:bg-base-300 p-3 rounded overflow-auto whitespace-pre-wrap">
            {responseBody}
          </pre>
      {:else}
        <pre
          class="text-xs font-mono bg-gray-50 dark:bg-base-300 p-3 rounded overflow-auto whitespace-pre-wrap text-gray-500 dark:text-neutral-400">
            Unsupported Content Type for Preview
          </pre>
      {/if}
    {:else if activePreviewTab === "raw"}
      {#if isHTML(contentType)}
        <div class="wrap">
          <CodeMirror
            value={responseBody}
            lang={html()}
            styles={{
              "&": {
                maxWidth: "100%",
                height: "100%",
                fontSize: "10pt",
              },
            }}
            theme={editorTheme()}
            readonly = {true}
            placeholder="HTML Preview"
          />
        </div>
      {:else}
        <div class="wrap">
          <pre
            class="text-xs font-mono bg-gray-50 dark:bg-base-300 p-3 rounded overflow-auto whitespace-pre-wrap">{responseBody}
        </pre>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .wrap {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100dvh - 148px);
    width: 100%;
    font-size: 10pt;
    line-height: 1.4;
  }
</style>
