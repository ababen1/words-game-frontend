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


export const suitMap: Record<string, Suit> = {
  heart: "HEART",
  hearts: "HEART",
  diamond: "DIAMOND",
  diamonds: "DIAMOND",
  club: "CLUB",
  clubs: "CLUB",
  spade: "SPADE",
  spades: "SPADE",
  joker: "JOKER",
};

export const rankMap: Record<string, Rank> = {
  a: "A",
  ace: "A",
  j: "JACK",
  jack: "JACK",
  q: "QUEEN",
  queen: "QUEEN",
  k: "KING",
  king: "KING",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
};


export const isRed = (s: Suit) => s === "HEART" || s === "DIAMOND";
export const isBlack = (s: Suit) => s === "CLUB" || s === "SPADE";
