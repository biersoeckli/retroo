<script lang="ts">
  import { RetroManager } from "./business/retro-manager";
  import { navigate } from "svelte-routing";
  import { caclulateTextarea } from "./utils/textarea-utils";
  import { RandomColorGenerator } from "./utils/random-color-generator";
  import { Loady } from "./utils/loady";
  import { SimpleOverlayModel } from "./models/alert-model";

  const retroManager = RetroManager.instance;
  $: retroNameUserInput = "";
  async function createNewRetro() {
    Loady.on(async () => {
      await retroManager.createNewRetro(retroNameUserInput);
      navigate(`/retro?id=${retroManager.shareKeyString}`);
    }, new SimpleOverlayModel("Oh no! 💩", "An error occured. Please try again."));
  }

  const baseColor = RandomColorGenerator.getRadmonColor();
</script>

<div class="h-screen bg-slate-50 pt-20 pr-10 pl-10">
  <div class="container mx-auto max-w-lg">
    <div class={`rounded-xl rotate-6 bg-${baseColor}-300 `}>
      <div class={`rounded-xl shadow -rotate-6 p-10 md:p-20 bg-white`}>
        <div class="text-5xl md:text-6xl font-bold text-cyan-900 " style="">
          Hey there!<br /> Create your
          <span class={`text-${baseColor}-300 text-underline`}>retroo</span> board
        </div>
        <div class=" ease-in duration-200">
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
              class="invisibleInput text-5xl md:text-6xl font-bold "
              placeholder="name here..."
              autocomplete="off"
              bind:value={retroNameUserInput}
              on:keyup={caclulateTextarea}
              autofocus
            />
          </div>

          {#if retroNameUserInput}
            <div
              class="bg-green-400 rounded-lg float-right p-2 w-fit cursor-pointer mt-3 hover:bg-green-500 ease-in-out duration-200"
              on:click={createNewRetro}
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

            <div class="h-10" />
          {:else}
            <div class="text-xs text-slate-300 text-center mt-4">
              🆓 and 🔒 Retro Boards
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="bottom-6 absolute text-center text-xs text-slate-400 w-screen invisible md:visible"
>
  <p class="">Decentralized, End-To-End Encrypted, Peer-To-Peer Retro Boards | <a href="https://github.com/biersoeckli/retroo" class="underline">Github</a></p>
</div>
