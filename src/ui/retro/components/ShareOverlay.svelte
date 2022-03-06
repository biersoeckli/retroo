<script lang="ts">
  import type { Retro } from "../../../models/retro";
  import { RandomColorGenerator } from "../../../utils/random-color-generator";

  export let input: Retro = undefined;

  const baseColor = RandomColorGenerator.getRadmonColor();
  $: copyText = "copy url";
  $: copyBtnColor = "gray";

  function copyUrl() {
    navigator.clipboard.writeText(location.href);
    copyText = "copied!";
    copyBtnColor = "green";
  }
</script>

{#if input}
  <div class="mt-3 text-center sm:mt-0 sm:ml-4 m-auto">
    <h3 class="text-xl leading-6 font-medium text-gray-900 ">
      💬 Share your awesome retroo "<span class={`text-${baseColor}-600`}
        >{input.name}</span
      >"!
    </h3>

    <div class="mt-2">
      <p class="text-sm text-gray-500">
        Copy the url of this <span class={`text-${baseColor}-600`}
          ><strong>retroo</strong></span
        > and share it with your team 👩‍💻 🧑‍💻
      </p>
    </div>
    <div class="mt-5 ">
      <button
        on:click={copyUrl}
        class={`w-full inline-flex justify-center rounded-md border border-transparent 
              shadow-sm px-4 py-2 bg-${copyBtnColor}-600 text-base font-medium text-white uppercase
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${copyBtnColor}-500 sm:ml-3 sm:w-auto sm:text-sm`}
      >
        {copyText}
      </button>
    </div>
  </div>
{/if}
