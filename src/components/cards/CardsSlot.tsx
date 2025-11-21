import type { PlayingCardInfo } from "@/types/CardsTypes";
import React from "react";

export interface CardsSlotProps extends React.HTMLAttributes<HTMLDivElement> {
    cards: PlayingCardInfo[];
}

export default function CardsSlot({

}: CardsSlotProps) {
    return (
        <div>
        </div>
    );
}