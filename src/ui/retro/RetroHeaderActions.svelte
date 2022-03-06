<script lang="ts">
  import { navigate } from "svelte-routing";
  import { AnonymousUserManager } from "../../business/anonymous-user-manager";
  import { RetroManager } from "../../business/retro-manager";
  import OverlayButton from "../components/OverlayButton.svelte";
  import ToggleSwitch from "../components/ToggleSwitch.svelte";
  import { DownloadUtils } from "../../utils/download-utils";
  import { SimpleOverlay } from "../../utils/alert-service";
  import { WritableService } from "../writable-services";
  import { OverlayModel } from "../../models/overlay-model";
  import ShareOverlay from "./components/ShareOverlay.svelte";

  const retroManager = RetroManager.instance;
  let editMode =
    retroManager.retro.createdBy === AnonymousUserManager.getUserId();

  function openEditMode() {
    navigate("/retro/edit?id=" + retroManager.shareKeyString);
  }

  async function toggleVisability() {
    retroManager.retro.showCardData = !retroManager.retro.showCardData;
    await retroManager.saveRetro();
  }

  const actionButtons = new Map<string, () => void>()
    .set("🖊  Edit", () => openEditMode())
    .set("💬  Share", () => WritableService.overlayService.set(new OverlayModel(ShareOverlay, new Map<string, () => Promise<void>>().set('CLOSE', undefined), retroManager.retro)))
    .set("⬇️  Download", () => setTimeout(() => DownloadUtils.exportCurrentBody(), 500))
    .set("👋  Leave", () => window.open("/", "_self"));

  function showSecurityAlert() {
    SimpleOverlay.show(
      "Hey there!",
      "This is retroo. It's an End-To-End encrypted, Peer-To-Peer, decentraliced, <a href=\"https://github.com/biersoeckli/retroo\" class=\"underline\">open-source</a> project to delight your retrospectives. This site is build on top of gun.js, Svelte and tailwindcss, hope you enjoy it 😁."
    );
  }
</script>

{#if editMode}
  <div class="absolute right-6">
    <div class="flex flex-row">
      <div class="px-3 basis-1/2 mt-2.5">
        <ToggleSwitch
          clickAction={toggleVisability}
          initialState={retroManager.retro.showCardData}
        />
      </div>
      <div class="px-3 basis-1/2">
        <OverlayButton {actionButtons} />
        <!--svg
        on:click={openEditMode}
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 absolute right-6 mt-2 text-slate-700 hover:text-blue-600 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg-->
      </div>
    </div>
  </div>
{:else}
  <div on:click={showSecurityAlert}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 absolute right-6 mt-2 text-slate-700"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
{/if}
