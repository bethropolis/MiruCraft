<script>
  // @ts-ignore
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { code } from "../../lib/store/store";
  import { DB } from "../../lib/db/local";
  import {
    codeCompletions,
    jsMetadataCompletions,
  } from "../../lib/editor/autocomplete";
  import { saveCurrentLocal } from "../../lib/extension/saveCurrent";
  import { editorTheme } from "../../lib/editor/editorTheme";

  let debounceTimeout;
  const debounceDelay = 300; // delay in milliseconds

  // Debounce function for optimizing save operations
  const saveCode = (code) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      DB.set("code", code);
      saveCurrentLocal(code);
    }, debounceDelay);
  };


</script>

<CodeMirror
  bind:value={$code}
  lang={javascript()}
  styles={{
    "&": {
      maxWidth: "100%",
      height: "100vh",
      fontSize: "10pt"
    },
  }}
  theme={editorTheme()}
  extensions={[jsMetadataCompletions, codeCompletions]}
  placeholder="Write your code here...(Ctrl+Space) for autocomplete"
  on:change={(c) => saveCode(c.detail)}
/>
