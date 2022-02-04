export class OverlayModel {
    constructor(
      public component: any,
      public actionButtons?: Map<string, () => Promise<void>>,
      public componentInput?: any
    ) {}
  }