import React, { useRef, useState, useEffect } from "react";

// SolitaireCardDrag.tsx
// A single-file React component demo that implements draggable playing cards
// and allows placing one card (or a sequence) onto another stack.
// - Uses pointer events (no external libs)
// - Parent component: <SolitaireTable /> shows a few sample stacks
// - Card visuals are simple and styled with Tailwind classes
// - Drop detection is done by checking registered drop target bounding boxes

// Usage: render <SolitaireTable /> inside your app. Tailwind recommended.

type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export type CardModel = {
  id: string; // unique id
  rank: string; // e.g. "A", "2"..."K"
  suit: Suit;
  faceUp: boolean;
};

// Helpers
const suitSymbol = (s: Suit) => (s === "hearts" ? "♥" : s === "diamonds" ? "♦" : s === "clubs" ? "♣" : "♠");
const isRed = (s: Suit) => s === "hearts" || s === "diamonds";

// --- Drag state types ---
type DragPayload = {
  cards: CardModel[]; // card or sequence being dragged
  fromStack: number; // index of stack we dragged from
  offsetX: number; // pointer offset inside dragged element
  offsetY: number;
};

// --- Card component ---
function Card({ card, onPointerDown }: { card: CardModel; onPointerDown: (e: React.PointerEvent, card: CardModel) => void }) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, card)}
      className={`w-24 h-32 rounded-lg shadow-md select-none border-2 ${card.faceUp ? "bg-white" : "bg-gray-200"} flex flex-col justify-between p-2 relative`}
      style={{
        userSelect: "none",
      }}
    >
      {card.faceUp ? (
        <>
          <div className="text-sm font-semibold">{card.rank}</div>
          <div className={`text-2xl self-end ${isRed(card.suit) ? "text-red-600" : "text-black"}`}>{suitSymbol(card.suit)}</div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">🂠</div>
      )}
    </div>
  );
}

// --- Stack column (drop target) ---
function StackColumn({
  cards,
  stackIndex,
  onPointerDownCard,
  registerDropTarget,
}: {
  cards: CardModel[];
  stackIndex: number;
  onPointerDownCard: (e: React.PointerEvent, card: CardModel, idxInStack: number) => void;
  registerDropTarget: (el: HTMLElement | null, stackIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerDropTarget(ref.current, stackIndex);
    return () => registerDropTarget(null, stackIndex);
  }, [registerDropTarget, stackIndex]);

  return (
    <div ref={ref} className="w-28 min-h-[10rem] p-1">
      <div className="relative">
        {cards.map((c, i) => (
          <div
            key={c.id}
            style={{ position: "absolute", top: `${i * 36}px`, left: 0 }}
            onPointerDown={(e) => onPointerDownCard(e, c, i)}
          >
            <Card card={c} onPointerDown={(e) => onPointerDownCard(e, c, i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main table ---
export default function SolitaireTable() {
  // Example stacks: arrays of CardModel
  const [stacks, setStacks] = useState<CardModel[][]>(() => {
    // simple sample data
    const make = (rank: string, suit: Suit, idSuffix: number) => ({ id: `${rank}${suit}${idSuffix}`, rank, suit, faceUp: true });
    return [
      [make("K", "hearts", 1)],
      [make("Q", "clubs", 2), make("J", "hearts", 3), make("10", "clubs", 4)],
      [make("9", "spades", 5)],
      [make("8", "diamonds", 6), make("7", "clubs", 7)],
      [],
      [make("6", "spades", 8)],
      [],
    ];
  });

  // Keep refs of drop targets
  const dropTargets = useRef<Map<number, DOMRect | null>>(new Map());

  const registerDropTarget = (el: HTMLElement | null, index: number) => {
    if (el) {
      dropTargets.current.set(index, el.getBoundingClientRect());
    } else {
      dropTargets.current.delete(index);
    }
  };

  // Dragging state
  const [drag, setDrag] = useState<DragPayload | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!drag) return;
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!drag) return;
      // Detect which drop target contains the pointer
      let droppedOn: number | null = null;
      for (const [idx, rect] of dropTargets.current.entries()) {
        if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          droppedOn = idx;
          break;
        }
      }

      if (droppedOn !== null) {
        // Move cards from drag.fromStack to droppedOn
        setStacks((prev) => {
          const copy = prev.map((s) => s.slice());
          const from = copy[drag.fromStack];
          // find the starting index of the dragged sequence inside 'from' by locating first card id
          const firstDraggedId = drag.cards[0].id;
          const startIdx = from.findIndex((c) => c.id === firstDraggedId);
          if (startIdx === -1) return prev; // safety
          const moved = from.splice(startIdx, drag.cards.length);
          // append moved sequence to droppedOn
          copy[droppedOn] = copy[droppedOn].concat(moved);
          return copy;
        });
      }

      // clear drag
      setDrag(null);
      setPointerPos(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [drag]);

  // Called when user starts dragging a card in a stack
  const onPointerDownCard = (e: React.PointerEvent, card: CardModel, idxInStack?: number) => {
    e.preventDefault();
    // find which stack this card belongs to
    const stackIndex = stacks.findIndex((s) => s.some((c) => c.id === card.id));
    if (stackIndex === -1) return;
    const stack = stacks[stackIndex];
    const startIdx = stack.findIndex((c) => c.id === card.id);
    if (startIdx === -1) return;

    // sequence of cards to drag (card + any cards on top of it)
    const sequence = stack.slice(startIdx);

    // capture pointer
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const rect = (e.target as Element).closest("div")?.getBoundingClientRect();
    const offsetX = rect ? e.clientX - rect.left : 0;
    const offsetY = rect ? e.clientY - rect.top : 0;

    setDrag({ cards: sequence, fromStack: stackIndex, offsetX, offsetY });
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  // Render floating dragged cards
  const renderFloating = () => {
    if (!drag || !pointerPos) return null;
    const style: React.CSSProperties = {
      position: "fixed",
      left: pointerPos.x - drag.offsetX,
      top: pointerPos.y - drag.offsetY,
      zIndex: 9999,
      pointerEvents: "none",
    };
    return (
      <div style={style}>
        {drag.cards.map((c, i) => (
          <div key={c.id} style={{ marginTop: i === 0 ? 0 : 36 }}>
            <div className={`w-24 h-32 rounded-lg shadow-lg border-2 ${c.faceUp ? "bg-white" : "bg-gray-200"} p-2`}>
              <div className="text-sm font-semibold">{c.rank}</div>
              <div className={`text-2xl self-end ${isRed(c.suit) ? "text-red-600" : "text-black"}`}>{suitSymbol(c.suit)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Solitaire-like card dragging demo</h2>
      <div className="flex gap-4">
        {stacks.map((s, idx) => (
          <StackColumn
            key={idx}
            cards={s}
            stackIndex={idx}
            onPointerDownCard={(e, card, i) => onPointerDownCard(e, card, i)}
            registerDropTarget={(el, index) => {
              // update rect each time - helpful on layout change
              if (el) dropTargets.current.set(index, el.getBoundingClientRect());
              else dropTargets.current.delete(index);
            }}
          />
        ))}
      </div>

      {/* floating dragged cards */}
      {renderFloating()}

      <div className="mt-4 text-sm text-gray-500">
        Tip: drag any face-up card. That card and any on top of it will be moved as a sequence to the target stack.
      </div>
    </div>
  );
}
