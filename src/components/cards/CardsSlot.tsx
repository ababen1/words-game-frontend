import type { PlayingCardInfo } from "@/types/CardsTypes";
import { rankMap, suitMap } from "@/types/CardsTypes";
import { useDroppable } from "@dnd-kit/core";
import { useDndMonitor } from "@dnd-kit/core";
import React, { useMemo, useState } from "react";
import PlayingCard from "./PlayingCard";
import type { UniqueIdentifier } from "@dnd-kit/core";

export interface CardsSlotProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
    cards: PlayingCardInfo[];
    slotId: string;
    onCardDrop?: (card: PlayingCardInfo) => void;
    canDrop?: (card: PlayingCardInfo, currentCards: PlayingCardInfo[]) => boolean;
    minHeight?: number;
    cardSize?: number;
}

/** Parse card ID from format "rank-suit" (e.g., "A-spade") */
function parseCardId(id: UniqueIdentifier): PlayingCardInfo | null {
    const [rankPart, suitPart] = String(id).split("-");
    if (!rankPart || !suitPart) return null;
    const normalizedRank = rankMap[rankPart.toLowerCase()];
    const normalizedSuit = suitMap[suitPart.toLowerCase()];
    if (!normalizedRank || !normalizedSuit) return null;
    return { rank: normalizedRank, suit: normalizedSuit };
}

export default function CardsSlot({
    cards,
    slotId,
    onCardDrop,
    canDrop,
    minHeight,
    cardSize = 120,
    className = "",
    ...rest
}: CardsSlotProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: slotId,
    });

    // Track the active drag state and validation
    const [activeCardInfo, setActiveCardInfo] = useState<PlayingCardInfo | null>(null);
    const [isValidDrop, setIsValidDrop] = useState(false);

    // Monitor drag events to validate drops
    useDndMonitor({
        onDragStart(event) {
            const cardInfo = parseCardId(event.active.id);
            if (cardInfo) {
                setActiveCardInfo(cardInfo);
                // Check if this card can be dropped
                const valid = canDrop ? canDrop(cardInfo, cards) : true;
                setIsValidDrop(valid);
            }
        },
        onDragEnd(event) {
            // If the drop was successful and on this slot, call onCardDrop
            if (
                event.over?.id === slotId &&
                activeCardInfo
            ) {
                // Recalculate validation with current cards array
                const valid = canDrop ? canDrop(activeCardInfo, cards) : true;
                if (valid && onCardDrop) {
                    onCardDrop(activeCardInfo);
                }
            }
            setActiveCardInfo(null);
            setIsValidDrop(false);
        },
        onDragCancel() {
            setActiveCardInfo(null);
            setIsValidDrop(false);
        },
    });

    // Get the top card (last card in the array)
    const topCard = useMemo(() => {
        return cards.length > 0 ? cards[cards.length - 1] : null;
    }, [cards]);

    // Determine drop zone styling
    const dropZoneStyle = useMemo(() => {
        const cardHeight = Math.round((cardSize / 3) * 4);
        return {
            minHeight: minHeight || cardHeight,
            minWidth: cardSize,
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: isOver
                ? isValidDrop
                    ? "rgba(76, 175, 80, 0.1)" // Green tint for valid drop
                    : "rgba(244, 67, 54, 0.1)" // Red tint for invalid drop
                : "rgba(0, 0, 0, 0.02)",
            borderColor: isOver
                ? isValidDrop
                    ? "#4caf50"
                    : "#f44336"
                : "#ccc",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
        } as React.CSSProperties;
    }, [isOver, isValidDrop, minHeight, cardSize]);

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={dropZoneStyle}
            {...rest}
            role="group"
            aria-label={`Card slot ${slotId}`}
        >
            {topCard ? (
                <PlayingCard
                    info={topCard}
                    draggable={false}
                    size={cardSize}
                    faceUp={true}
                />
            ) : (
                <div
                    style={{
                        color: "#999",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    Empty
                </div>
            )}
        </div>
    );
}