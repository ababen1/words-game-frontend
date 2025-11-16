import type { Rank } from "@/types/CardsTypes";

export function getNumericalRank(rank: Rank): number {
    if (rank === "A") return 1;
    if (rank === "JACK") return 11;
    if (rank === "QUEEN") return 12;
    if (rank === "KING") return 13;
    return parseInt(rank);
}

export function isFaceCard(rank: Rank): boolean {
    return rank === "JACK" || rank === "QUEEN" || rank === "KING";
}