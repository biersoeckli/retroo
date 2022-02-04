<script lang="ts">
  import { RetroManager } from "./business/retro-manager";
  import { Router, Route } from "svelte-routing";
  import Retro from "./ui/retro/Retro.svelte";
  import Home from "./Home.svelte";
  import RetroEdit from "./ui/retro/edit/RetroEdit.svelte";
  import AlertView from "./ui/components/SimpleOverlay.svelte";
  import Loader from "./ui/components/Loader.svelte";
  import Overlay from "./ui/components/Overlay.svelte";
  const retroManager = RetroManager.instance;
  const urlParams = new URLSearchParams(window.location.search);

  export let url = "";
</script>

<Router {url}>
  <div>
    <Route path="retro" component={Retro} />
    <Route path="retro/edit" component={RetroEdit} />
    <Route path="/" component={Home} />
  </div>
</Router>
<AlertView />
<Loader />
<Overlay />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(.invisibleInput) {
    background-color: transparent;
    width: 100%;
    outline: none;
    border: none;
    outline: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
