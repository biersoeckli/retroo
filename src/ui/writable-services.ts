import { writable } from "svelte/store";
import type { SimpleOverlayModel } from "../models/alert-model";
import type { OverlayModel } from "../models/overlay-model";

export class WritableService {
    public static loaderService = writable<boolean>();
    public static overlayService = writable<OverlayModel>();
}