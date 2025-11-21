import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import { useState } from "react";
import PlayingCard from "./PlayingCard";
import type { Rank, Suit } from "@/types/CardsTypes";

export default function CardTable() {
    const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    /** parse "A-spades" → { rank: "A", suit: "spades" } */
    function parseCardId(id: UniqueIdentifier): { rank: Rank; suit: Suit } {
        const [rank, suit] = String(id).split("-");
        return { rank: rank as Rank, suit: suit as Suit };
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={(event) => setActiveCardId(event.active.id)}
            onDragEnd={() => setActiveCardId(null)}
            onDragCancel={() => setActiveCardId(null)}
        >
            {/* Cards rendered normally - no dragging transforms applied */}
            <div style={{ display: "flex", gap: 20 }}>
                <PlayingCard info={{ rank: "A", suit: "SPADE" }} draggableId="A-spades" />
                <PlayingCard info={{ rank: "QUEEN", suit: "HEART" }} draggableId="Q-hearts" />
                <PlayingCard info={{ rank: "10", suit: "DIAMOND" }} draggableId="10-diamonds" />
            </div>

            {/* Floating overlay that moves with the cursor */}
            <DragOverlay>
                {activeCardId
                    ? (() => {
                        const { rank, suit } = parseCardId(activeCardId);
                        return <PlayingCard info={{ rank, suit }} />;
                    })()
                    : null}
            </DragOverlay>
        </DndContext>
    );
}
