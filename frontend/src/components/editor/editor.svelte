<script>
  // @ts-ignore
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { lintGutter, linter } from "@codemirror/lint";
  import { code, config } from "../../lib/store/store";
  import { DB } from "../../lib/db/local";
  import { codeCompletions, jsMetadataCompletions } from "../../lib/editor/autocomplete";
  import { saveCurrentLocal } from "../../lib/extension/saveCurrent";
  import { editorTheme } from "../../lib/editor/editorTheme";


  const debounceDelay = 300; // in milliseconds

  let debounceTimeout;
  const saveCode = (codeText) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      DB.set("code", codeText);
      saveCurrentLocal(codeText);
    }, debounceDelay);
  };

  let jshintWorker = null;
  if (typeof Worker !== "undefined") {
    // Only create the worker if linting is enabled
    if ($config.isLinterEnabled) {
      jshintWorker = new Worker(
        new URL("../../lib/utils/jshint-worker", import.meta.url)
      );
    }
  }

  // Helper: Run JSHint in the worker and return a promise with the results.
  const runJSHintInWorker = (codeText) => {
    return new Promise((resolve) => {
      jshintWorker.addEventListener(
        "message",
        (e) => {
          resolve(JSON.parse(e.data.result));
        },
        { once: true }
      );
      jshintWorker.postMessage({ 
        task: "lint", 
        code: codeText, 
        config: { 
          esversion: 11, 
          asi: true,
          expr: true, 
        }
      });
    });
  };

  // Lint extension using our worker helper.
  // If linting is disabled, simply return an empty array of diagnostics.
  const jshintLinter = linter(view => {
    if (!$config.isLinterEnabled) return Promise.resolve([]);
    return runJSHintInWorker(view.state.doc.toString()).then(ret => {
      return (ret.errors || [])
        .filter(err => err)
        .map(err => {
          const lineObj = view.state.doc.line(err.line);
          const pos = lineObj.from + err.character - 1;
          const severity =
            err.code && err.code[0].toUpperCase() === "W" ? "warning" : "error";
          return {
            from: pos,
            to: pos + 1,
            severity,
            message: err.reason,
            source: `JSHint - ${err.code}`,
          };
        });
    });
  });

  // Build the extensions array conditionally based on lintingEnabled.
  const extensions = [
    jsMetadataCompletions,
    codeCompletions,
    ...($config.isLinterEnabled ? [jshintLinter, lintGutter()] : [])
  ];


  console.log($config.isLinterEnabled)
</script>

<CodeMirror
  bind:value={$code}
  lang={javascript()}
  styles={{
    "&": { 
      maxWidth: "100%",
      height: "100vh",
      fontSize: "10pt",
    },
  }}
  theme={editorTheme()}
  extensions={extensions}
  placeholder="Write your code here...(Ctrl+Space) for autocomplete"
  on:change={(c) => saveCode(c.detail)}
/>
