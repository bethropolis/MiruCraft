<script>
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { jsonStore } from '../../lib/store/store';

  let json = [];

  jsonStore.subscribe(value => {
    if (value) {
      json = JSON.parse(value);
    }
  });
</script>

<div class="wrap">
  <JsonView bind:json />
</div>

<style>
  .wrap {
    /* Ensure scrolling is enabled within the container */
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100dvh - 48px - 1rem); /* Adjust to fit within the viewport as needed */
    width: 100%;
    font-size: 10pt;
    line-height: 1.4;

    }
    
    :global(.dark) {
      /* JSON colors (Dracula theme) */
      --jsonBracketHoverBackground: #44475A;
      --jsonValColor: #F8F8F2;
      --jsonKeyColor: #FF79C6;
      --jsonValStringColor: #F1FA8C;
      --jsonValNumberColor: #BD93F9;
      --jsonValBooleanColor: #BD93F9;
    }
</style>
