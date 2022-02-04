import { SimpleOverlayModel } from "../models/alert-model";
import { OverlayModel } from "../models/overlay-model";
import { WritableService } from "../ui/writable-services";
import { RandomColorGenerator } from "./random-color-generator";
import AlertView from '../ui/components/SimpleOverlay.svelte'

export class SimpleOverlay {
    public static show(title: string, text: string, buttonText: string = 'OK') {
        this.showSimpleOverlayModel(new SimpleOverlayModel(title, text, buttonText));
    }

    public static showSimpleOverlayModel(alertModel: SimpleOverlayModel) {
        alertModel.text = alertModel.text?.replace('retroo', 
        `<span class="text-${RandomColorGenerator.getRadmonColor()}-400"><strong>retroo</strong></span>`);
        const actionButtons = alertModel.buttonText === '' ? undefined : new Map<string, () => Promise<void>>().set(alertModel.buttonText ?? 'OK', undefined);
        WritableService.overlayService.set(new OverlayModel(AlertView, actionButtons, alertModel));
    }
}