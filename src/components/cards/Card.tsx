import type { Rank, Suit } from "@/types/CardsTypes";
import { getNumericalRank, isFaceCard } from "@/util/CardsFuncs";
import React from "react";

export interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rank: Rank;
  suit: Suit;
  faceUp?: boolean; // if false, shows the card back
  size?: number; // width in pixels (height calculated with 3:4 ratio)
  className?: string;
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
export default function PlayingCard({
  rank,
  suit,
  faceUp = true,
  size = 120,
  className = "",
  ...rest
}: PlayingCardProps) {
  const width = size;
  const height = Math.round((size / 3) * 4); // 3:4 ratio
  // aria-label for screen readers
  const ariaLabel = faceUp ? `${rank} of ${suit}` : "Playing card, face down";

  return (
    <div
      {...rest}
      role="img"
      aria-label={ariaLabel}
      className={`${className}`}
      style={{ width, height }}
    >
        <div>
          <img 
            src={getFilename(rank, suit, faceUp)} 
            alt={`${rank} of ${suit}`} 
            className="w-full h-full object-cover" />
        </div>
    </div>
  );
}

// Example usage (not exported):
// <PlayingCard rank="A" suit="spades" size={140} />
// <PlayingCard rank="10" suit="hearts" faceUp={true} />
// <PlayingCard rank="Q" suit="diamonds" faceUp={false} />
