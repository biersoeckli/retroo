<script lang="ts">
  export let actionButtons: Map<string, () => void> = new Map<
    string,
    () => void
  >();

  $: showOverlay = false;

  function toggleOverlay() {
    showOverlay = !showOverlay;
  }

  function executeAction(action: () => void): any {
    toggleOverlay()
    action();
  }
</script>

{#if actionButtons && actionButtons.size !== 0}
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="relative inline-block text-left">
    <div>
      <button
        on:click={toggleOverlay}
        type="button"
        class="-mt-1 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
      </button>
    </div>

    <!--
      Dropdown menu, show/hide based on menu state.
  
      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->

    {#if showOverlay}
      <div
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
          {#each [...actionButtons] as [key, value]}
            <a
              on:click={executeAction(value)}
              class="text-gray-700 block px-4 py-2 text-sm cursor-pointer"
              role="menuitem"
              tabindex="-1"
              id="menu-item-0">{key}</a
            >
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
