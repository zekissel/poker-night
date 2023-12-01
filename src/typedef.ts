export interface Player {
    id: number;
    name: string;
    money: number;
    call: number;
    fold: boolean;
    blind: Blinds;
    card1: Card | undefined;
    card2: Card | undefined;
}

export enum Blinds {
    None,
    Dealer,
    Small,
    Big,
}

export enum Rank {
    Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King
}

export enum Suit {
    Clubs, Diamonds, Hearts, Spades
}

export interface Card {
    rank: Rank;
    suit: Suit;
}