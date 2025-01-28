<script>
    export let show = false;
</script>

<svg
    class={`w-4 h-4 text-gray-500 dark:text-neutral-400 transition-transform ${show ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
    />
</svg>