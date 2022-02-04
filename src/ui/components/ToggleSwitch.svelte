<script lang="ts">
  export let clickAction: () => void = undefined;
  export let initialState = false;

  $: checkboxState = initialState;

  function toggle() {
    if (clickAction) {
      clickAction();
    }
    checkboxState = !checkboxState;
  }
</script>

<!-- Toggle A -->
<div class="flex items-center justify-center remove-click-backgr">
  <label for="toogleA" class="flex items-center cursor-pointer">
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        id="toogleA"
        type="checkbox"
        class="sr-only"
        checked={checkboxState}
        on:click={toggle}
      />
      <!-- line -->
      <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
      <!-- dot -->
      <div
        class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"
      >
        {#if checkboxState}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 pt-1 pl-1 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 pt-1 pl-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        {/if}
      </div>
    </div>
    <!-- label >
    <div class="ml-3 text-gray-700 font-medium">Visability</div-->
  </label>
</div>

<style>
  input:checked ~ .dot {
    transform: translateX(100%);
    background-color: #48bb78;
  }

  .remove-click-backgr {
    -webkit-tap-highlight-color: transparent;
  }
</style>
