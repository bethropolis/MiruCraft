<script>
    export let request;
    export let setSelectedRequest;
  
    let selectedRequest = {};
  </script>
  
  <button
    id={`req-${request.id}`}
    on:click={() => setSelectedRequest(request.id)}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') setSelectedRequest(request.id);
    }}
    class="w-full p-2 border-b cursor-pointer hover:bg-gray-200  dark:hover:bg-slate-600 text-left w-full focus:outline-none"
    class:bg-blue-50={selectedRequest?.id === request.id}
    class:dark:bg-blue-900={selectedRequest?.id === request.id}
  >
    <div class="flex items-center gap-2 mb-1">
      <span class="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-700 dark:text-white">
        {request.extension}
      </span>
      <span
        class="text-xs px-1.5 py-0.5 rounded"
        class:bg-green-100={request.status < 400}
        class:text-green-700={request.status < 400}
        class:dark:bg-green-900={request.status < 400}
        class:dark:text-green-200={request.status < 400}
        class:bg-red-100={request.status >= 400}
        class:text-red-700={request.status >= 400}
        class:dark:bg-red-900={request.status >= 400}
        class:dark:text-red-200={request.status >= 400}
      >
        {request.status}
      </span>
      <span
        class="text-xs px-1.5 py-0.5 rounded"
        class:bg-purple-100={request.method === 'POST'}
        class:text-purple-700={request.method === 'POST'}
        class:dark:bg-purple-900={request.method === 'POST'}
        class:dark:text-purple-200={request.method === 'POST'}
        class:text-gray-500={request.method !== 'POST'}
        class:dark:text-neutral-400={request.method !== 'POST'}
      >
        {request.method}
      </span>
    </div>
    <div class="w-full text-xs font-mono truncate text-gray-600 dark:text-neutral-400">
      {request.url}
    </div>
  </button>
  
  <style>
    /* Styles can be added here if needed */
  </style>