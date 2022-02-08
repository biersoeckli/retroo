<script lang="ts">
  import { RetroManager } from "../../../business/retro-manager";
  import { caclulateTextarea } from "../../../utils/textarea-utils";
  import type { Column } from "../../../models/column";
  import { RandomColorGenerator } from "../../../utils/random-color-generator";

  const retroManager = RetroManager.instance;

  $: retroEdit = RetroManager.instance.retro;

  function addColumn() {
    (retroEdit.columns as Column[]).push(retroManager.createNewColumn());
    retroEdit = retroEdit;
  }

  function deleteColumn(col: Column): any {
    const columns = retroEdit.columns as Column[];
    const indexToRemove = columns.findIndex(
      (colSearch) => colSearch.id === col.id
    );
    if (indexToRemove >= 0) {
      columns.splice(indexToRemove, 1);
      retroEdit = retroEdit;
    }
  }
</script>

{#if retroEdit}
  <div class="flex flex-row">
    <div class="px-3 basis-1/2">
      <div
        class={`rounded bg-slate-100 p-2 uppercase text-base text-slate-600 font-semibold`}
      >
        Name
      </div>
    </div>
    <div class="px-3 basis-1/2">
      <div
        class={`rounded bg-slate-100 p-2 uppercase text-base text-slate-600 font-semibold`}
      >
        Color
      </div>
    </div>
    <div class="px-3 basis-1/10 w-14" />
  </div>

  {#each retroEdit.columns as col}
    <div class="pt-4 flex flex-row">
      <div class="px-3 basis-1/2">
        <!-- name col -->
        <div
          class="
rounded-lg 
py-1 px-3
border-2 
border-dashed 
border-slate-200 
text-slate-800"
          type="text"
        >
          <input
            type="text"
            class="invisibleInput font-bold text-slate-800"
            placeholder="column name here..."
            autocomplete="off"
            bind:value={col.name}
            on:keyup={caclulateTextarea}
          />
        </div>
      </div>
      <div class="px-3 basis-1/2">
        <!-- color col -->
        <div
          class={`rounded-lg 
            py-1 px-3
            border-2 
            border-dashed 
            border-slate-200 
            text-slate-800`}
        >
          <select bind:value={col.color} class="invisibleInput">
            {#each RandomColorGenerator.availableColors as color}
              <option value={color}>
                {color}
              </option>
            {/each}
          </select>
        </div>
      </div>
      <div class="px-3 basis-1/10">
        <!-- delete button -->
        <div
          class="bg-red-300 rounded p-1 w-fit cursor-pointer mt-1 hover:bg-red-400 ease-in-out duration-200"
          on:click={deleteColumn(col)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>
    </div>
  {/each}
  <!-- add btn -->
  <div
    class="bg-slate-400 rounded p-1 w-fit cursor-pointer mt-5 ml-3 hover:bg-slate-500 ease-in-out duration-200"
    on:click={addColumn}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="mx-auto h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      /></svg
    >
  </div>
{/if}
