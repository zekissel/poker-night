export interface Player {
    name: string;
    money: number;
    call: number;
    fold: boolean;
    blind: Blinds
}

export enum Blinds {
    None,
    Big,
    Small,
}