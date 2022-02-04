<script lang="ts">
  import type { OverlayModel } from "../../models/overlay-model";
  import { WritableService } from "../writable-services";

  $: showOverlay = false;
  $: overlayModel = undefined;

  WritableService.overlayService.subscribe((model: OverlayModel) => {
    if (!model || showOverlay) {
      return;
    }
    showOverlay = true;
    overlayModel = model;
  });

  async function executeAction(action?: () => Promise<void>): Promise<any> {
    if (action) {
      await action();
    }
    showOverlay = false;
  }
</script>

{#if showOverlay && overlayModel}
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity"
        aria-hidden="true"
      />

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true">&#8203;</span
      >

      <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <svelte:component this={overlayModel.component} input={overlayModel.componentInput} />
          </div>
        </div>
        {#if overlayModel.actionButtons && overlayModel.actionButtons.size > 0}
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {#each [...overlayModel.actionButtons] as [key, value]}
              <button
                on:click={executeAction(value)}
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent 
      shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-800 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {key}
              </button>
            {/each}
          </div>
        {:else}
          <div class="py-2" />
        {/if}
      </div>
    </div>
  </div>
{/if}
