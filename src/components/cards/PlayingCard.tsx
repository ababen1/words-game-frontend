import type { PlayingCardInfo } from "@/types/CardsTypes";
import { useDraggable } from "@dnd-kit/core";
import React from "react";
import CardArt from "./CardArt";

export interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  info: PlayingCardInfo
  faceUp?: boolean; // if false, shows the card back
  size?: number; // width in pixels (height calculated with 3:4 ratio)
  className?: string;
  draggableId?: string;
  draggable?: boolean;
  hideWhileDragging?: boolean;
}

/**
 * Simple and flexible Playing Card component.
 * - Default size 120px width (3:4 aspect ratio -> 160px height).
 * - Accessible: role="img" with aria-label set to rank + suit when faceUp.
 */
export default function PlayingCard({
  info,
  faceUp = true,
  size = 120,
  className = "",
  draggableId,
  draggable = true,
  hideWhileDragging = false,
  ...rest
}: PlayingCardProps) {
  const width = size;
  const height = Math.round((size / 3) * 4); // 3:4 ratio
  // aria-label for screen readers
  const ariaLabel = faceUp ? `${info.rank} of ${info.suit}` : "Playing card, face down";
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: draggableId ?? `${info.rank}-${info.suit}`,
      disabled: !draggable,
    });

  return (
    <div
      ref={setNodeRef}
      {...(draggable ? listeners : undefined)}
      {...(draggable ? attributes : undefined)}
      {...rest}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{
        width: width,
        height: height,
        userSelect: "none",
        // vendor-prefixed property not present on React.CSSProperties; cast the whole object below
        WebkitUserDrag: "none",
        pointerEvents: isDragging ? "none" : "auto",
        touchAction: "none",
        opacity: isDragging && hideWhileDragging ? 0 : 1,
      } as React.CSSProperties}
      aria-hidden={isDragging && hideWhileDragging}
    >
      <CardArt info={info} faceUp={faceUp} width={width} height={height} />
    </div>
  );
}

// Example usage (not exported):
// <PlayingCard rank="A" suit="spades" size={140} />
// <PlayingCard rank="10" suit="hearts" faceUp={true} />
// <PlayingCard rank="Q" suit="diamonds" faceUp={false} />
