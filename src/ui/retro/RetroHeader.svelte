<script lang="ts">
  import RetroHeaderActions from "./RetroHeaderActions.svelte";
  import { navigate } from "svelte-routing";
  import { RetroManager } from "../../business/retro-manager";
  import OverlayButton from "../components/OverlayButton.svelte";
  const retroManager = RetroManager.instance;
  let retroName = retroManager.retro.name;
</script>

<div class="min-h-full">
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-5 gap-4">
        <div class="col-span-3">
          <h1 class="text-3xl font-bold text-gray-900">
            {retroName}
          </h1>
        </div>
        <div>
          <RetroHeaderActions />
        </div>
      </div>
    </div>
  </header>
</div>

<style>
</style>
