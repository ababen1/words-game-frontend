import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import PlayingCard from "./PlayingCard";
import { rankMap, suitMap, type PlayingCardInfo } from "@/types/CardsTypes";
import CardsSlot from "./CardsSlot";

/** parse "A-spades" → { rank: "A", suit: "spades" } */
function parseCardId(id: UniqueIdentifier): PlayingCardInfo | null {
    const [rankPart, suitPart] = String(id).split("-");
    if (!rankPart || !suitPart) return null;
    const normalizedRank = rankMap[rankPart.toLowerCase()];
    const normalizedSuit = suitMap[suitPart.toLowerCase()];
    if (!normalizedRank || !normalizedSuit) return null;
    return { rank: normalizedRank, suit: normalizedSuit };
}

export default function CardTable() {
    const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));
    const cardsOnTable = useMemo(
        () =>
            [
                { info: { rank: "A", suit: "SPADE" }, draggableId: "A-spade" },
                { info: { rank: "QUEEN", suit: "HEART" }, draggableId: "Q-heart" },
                { info: { rank: "10", suit: "DIAMOND" }, draggableId: "10-diamond" },
            ] as Array<{ info: PlayingCardInfo; draggableId: string }>,
        []
    );

    const activeCardInfo = useMemo(() => {
        if (!activeCardId) return null;
        return parseCardId(activeCardId);
    }, [activeCardId]);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={(event) => setActiveCardId(event.active.id)}
            onDragEnd={() => setActiveCardId(null)}
            onDragCancel={() => setActiveCardId(null)}
        >
            {/* Cards rendered normally - no dragging transforms applied */}
            <div style={{ display: "flex", gap: 20 }}>
                {cardsOnTable.map(({ info, draggableId }) => (
                    <PlayingCard
                        key={draggableId}
                        info={info}
                        draggableId={draggableId}
                        hideWhileDragging
                    />
                ))}
            </div>

            <div >
                <CardsSlot cards={[]} slotId="table" canDrop={() => true} />

            </div>

            {/* Floating overlay that moves with the cursor */}
            <DragOverlay>
                {activeCardInfo ? (
                    <PlayingCard info={activeCardInfo} draggable={false} hideWhileDragging={false} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
