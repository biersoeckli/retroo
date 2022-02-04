import type { SimpleOverlayModel } from "../models/alert-model";
import { WritableService } from "../ui/writable-services";
import { SimpleOverlay } from "./alert-service";

export class Loady {
    public static async on(ctx: () => Promise<void>, onErrorMessage: SimpleOverlayModel = undefined) {
        try {
            WritableService.loaderService.set(true);
            await ctx();
        } catch (ex) {
            if (onErrorMessage) {
                console.error(ex);
                SimpleOverlay.showSimpleOverlayModel(onErrorMessage);
            } else {
                throw ex;
            }
        } finally {
            WritableService.loaderService.set(false);
        }
    }
}