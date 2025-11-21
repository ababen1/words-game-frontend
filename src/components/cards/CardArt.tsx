import type { PlayingCardInfo, Rank, Suit } from "@/types/CardsTypes";
import { getNumericalRank, isFaceCard } from "@/util/CardsFuncs";
import React from "react";

export interface CardArt extends React.HTMLAttributes<HTMLDivElement> {
    info: PlayingCardInfo,
    faceUp: boolean; // if false, shows the card back
    width: number;
    height: number;
}
const getFilename = (rank: Rank, suit: Suit, faceUp: boolean = true) => {
    if (!faceUp) {
        return "cards/BACK.svg";
    }
    if (suit === "JOKER") {
        return "cards/JOKER-1.svg";
    }
    let name: string = `cards/${suit.toUpperCase()}-${getNumericalRank(rank)}`
    if (isFaceCard(rank)) {
        name += "-" + rank
    }
    return name + ".svg";
}

/**
 * Simple and flexible Playing Card component.
 * - Uses Tailwind classes for styling.
 * - Default size 120px width (3:4 aspect ratio -> 160px height).
 * - Accessible: role="img" with aria-label set to rank + suit when faceUp.
 */
export default function CardArt({
    info,
    faceUp,
    width,
    height
}: CardArt) {
    return (
        <img
            src={getFilename(info.rank, info.suit, faceUp)}
            alt={`${info.rank} of ${info.suit}`}
            draggable={false}
            style={{ width, height, pointerEvents: "none", userSelect: "none" }}
            className="w-full h-full object-cover"
        />
    );
}