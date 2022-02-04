<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { RetroManager } from "../../.../../../business/retro-manager";
  import type { Card } from "../../.../../../models/card";
  import type { Column } from "../../.../../../models/column";
  import { caclulateTextarea } from "../../.../../../utils/textarea-utils";

  export let column: Column;

  let baseColor = column?.color ?? "slate";

  const retroManager = RetroManager.instance;
  $: inEditMode = false;
  $: card = {} as Card;

  async function saveCardItem() {
    card.columnId = column.id;
    toggleEditMode();
    const card2Save = { ...card };
    card = {} as Card;
    await retroManager.saveCard(card2Save);
  }

  function toggleEditMode() {
    inEditMode = !inEditMode;
  }

  let lastShortcutCommand = undefined;
  function shortcutCheck(e) {
    if (
      e.keyCode === 83 &&
      (lastShortcutCommand === 17 || lastShortcutCommand === 18)
    ) {
      saveCardItem();
    }
    lastShortcutCommand = e.keyCode;
  }
</script>

<div class="mt-4">
  {#if inEditMode}
    <div class={"relative p-3 mt-4 bg-slate-1 rounded shadow border-t-4 border-" +
    baseColor +
    "-300"}>
      <div
        class="rounded-lg 
        py-1 px-3
      border-2 
      border-dashed 
    border-slate-200 
    text-slate-800"
        type="text"
      >
        <textarea
          class="invisibleInput text-md"
          bind:value={card.text}
          on:input={caclulateTextarea}
          on:keydown={shortcutCheck}
          rows="1"
          autofocus
        />
      </div>

      <div
        class="bg-red-400 rounded p-0.5 w-fit cursor-pointer float-right mt-2 hover:bg-red-500 ease-in-out duration-200"
        on:click={toggleEditMode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div
        class="bg-green-400 rounded p-0.5 w-fit cursor-pointer float-right mr-1 mt-2 hover:bg-green-500 ease-in-out duration-200"
        on:click={saveCardItem}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          /></svg
        >
      </div>

    <div class="h-6 text-slate-200 text-sm pt-2 invisible md:visible">
      save: alt + s
    </div>
    </div>
  {:else}
    <div
      on:click={toggleEditMode}
      class={`rounded-lg 
      border-2 
      border-dashed 
    border-gray-200 
    hover:border-${baseColor}-400 
    hover:text-${baseColor}-500 
      ease-in-out duration-200`}
    >
      <div class="cursor-pointer text-center p-2 lowercase">
        + Add to "{column.name}"
      </div>
    </div>
  {/if}
</div>

<style>
</style>
