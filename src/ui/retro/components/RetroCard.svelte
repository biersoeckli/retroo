<script lang="ts">
  import { AnonymousUserManager } from "../../../business/anonymous-user-manager";
  import { RetroManager } from "../../../business/retro-manager";
  import type { Card } from "../../../models/card";
  import type { Column } from "../../../models/column";
  import { caclulateTextarea } from "../../../utils/textarea-utils";

  export let card: Card;
  export let column: Column;
  export let showCardData = false;

  let baseColor = column?.color ?? "slate";

  const retroManager = RetroManager.instance;

  $: inEditMode = false;
  $: isEditable = card.createdBy === AnonymousUserManager.getUserId();

  async function saveCardItem() {
    toggleEditMode();
    await retroManager.saveCard(card);
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

<div
  class={"relative p-3 mt-4 bg-slate-1 rounded shadow border-t-4 border-" +
    baseColor +
    "-300"}
>
  {#if inEditMode}
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
        autocomplete="off"
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
  {:else}
    <div class="text-slate-700 relative">
      {card.text}
    </div>

    {#if isEditable}
      <div
        class={`bg-${baseColor}-400 rounded p-0.5 w-fit cursor-pointer float-right mt-1 hover:bg-${baseColor}-500 ease-in-out duration-200`}
        on:click={toggleEditMode}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-4 w-4 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </div>

      <div class="h-6" />
    {/if}
  {/if}

  {#if !showCardData}
    <div class="absolute inset-0 z-10  backdrop-blur-sm rounded" />
  {/if}
</div>

<style>
</style>
