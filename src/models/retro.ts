import type { Column } from "./column";

export interface Retro {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    showCardData: boolean;
    columns: Column[];
}