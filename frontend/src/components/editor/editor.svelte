<script>
  // @ts-ignore
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { dracula } from "@ddietr/codemirror-themes/dracula";
  import {materialLight} from '@ddietr/codemirror-themes/material-light'
  import { code, config } from "../../lib/store/store";
  import { DB } from "../../lib/db/local";
  import {
    codeCompletions,
    jsMetadataCompletions,
  } from "../../lib/editor/autocomplete";
  import { saveCurrentLocal } from "../../lib/extension/saveCurrent";

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


  const editorTheme = () =>{
    return $config.theme == "dark" ? dracula : materialLight;
  }
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
