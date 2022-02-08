<script lang="ts">
  import { RetroManager } from "../../../business/retro-manager";
  import { navigate } from "svelte-routing";
  import Retro from "../Retro.svelte";
  import { caclulateTextarea } from "../../../utils/textarea-utils";
  import type { Column } from "../../../models/column";
  import Loader from "../../components/Loader.svelte";
  import RetroEditColumns from "./RetroEditColumns.svelte";
  import { RandomColorGenerator } from "../../../utils/random-color-generator";
  import { Loady } from "../../../utils/loady";
  import { SimpleOverlayModel } from "../../../models/alert-model";

  const retroManager = RetroManager.instance;
  const urlParams = new URLSearchParams(window.location.search);

  const baseColor = RandomColorGenerator.getRadmonColor();

  $: retroEdit = undefined;

  initialize();
  async function initialize() {
    Loady.on(async () => {
      if (!urlParams.has("id")) {
        navigate("/");
      }
      await retroManager.initializeWithSharedKey(urlParams.get("id"));
      retroEdit = retroManager.retro;
    }, new SimpleOverlayModel("Oh no! 💩", "Sorry, we couldn't find the requested retroo board. Please verify that you are using the correct link.", ""));
  }

  async function saveRetro() {
    Loady.on(async () => {
      await retroManager.saveRetro();
      navigate("/retro?id=" + urlParams.get("id"));
    }, new SimpleOverlayModel("Oh no! 💩", "An error occured. Please try again."));
  }
</script>

{#if retroEdit}
  <div class="h-screen bg-slate-50 pt-20 pr-10 pl-10">
    <div class="container mx-auto max-w-4xl">
      <div class={`rounded-xl rotate-3 bg-${baseColor}-300 `}>
        <div class={`rounded-xl shadow -rotate-3 p-8 md:p-20 bg-white`}>
          <div
            class="
      rounded-lg 
      py-1 px-3
      border-2 
      border-dashed 
      border-slate-200 
      text-slate-800
      mt-2"
            type="text"
          >
            <input
              type="text"
              class="invisibleInput text-5xl md:text-6xl text-center font-bold text-slate-800"
              placeholder="name here..."
              autocomplete="off"
              bind:value={retroEdit.name}
              on:keyup={caclulateTextarea}
            />
          </div>
          <div class="font-bold text-slate-700 text-lg uppercase pt-12 pl-4">Column Settings</div>

          <div class="pt-5">
            <RetroEditColumns />
          </div>

          <div class="h-10" />
          <div
            class={`bg-${baseColor}-400 rounded-lg float-right p-2 w-fit cursor-pointer mt-3 hover:bg-${baseColor}-500 ease-in-out duration-200`}
            on:click={saveRetro}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mx-auto h-10 w-10 text-white"
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

          <div class="h-16 md:h-10" />
        </div>
      </div>
    </div>
  </div>
{/if}
