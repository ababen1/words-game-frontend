export type Suit = "HEART" | "DIAMOND" | "CLUB" | "SPADE" | "JOKER";

export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "JACK"
  | "QUEEN"
  | "KING";

export interface PlayingCardInfo {
  rank: Rank;
  suit: Suit;
}

export const isRed = (s: Suit) => s === "HEART" || s === "DIAMOND";
export const isBlack = (s: Suit) => s === "CLUB" || s === "SPADE";
