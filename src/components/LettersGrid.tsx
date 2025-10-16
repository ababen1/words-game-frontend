import { useEffect, useState } from "react";
import Letter from "./Letter";
import type { Vector2 } from "../types/GridTypes";

interface GridProps {
  cellsData: string[][];
}

export const LettersGrid: React.FC<GridProps> = ({ cellsData }) => {
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [selectedCells, setSelectedCells] = useState<Vector2[]>([]);

  const handleMouseDown = (cords: Vector2) => {
    setIsMouseDown(true);
    setSelectedCells([cords]);
  };

  const handleMouseEnter = (cords: Vector2) => {
    if (isMouseDown) {
      setSelectedCells((prev) => {
        if (!prev.find((c) => c.row == cords.row && c.col == cords.col)) {
          return [...prev, cords];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setSelectedCells([]);
  };

  const getSpelledWord = (): string => {
    let word = "";
    selectedCells.map((coords: Vector2) => {
      word += cellsData[coords.row][coords.col];
    });
    return word;
  };

  const isCellSelected = (cell: Vector2): boolean => {
    return selectedCells.some((c) => c.row === cell.row && c.col === cell.col);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div>
      {getSpelledWord()}
      <table>
        {cellsData.map((rowData: string[], rowIndex: number) => (
          <tr key={rowIndex}>
            {rowData.map((_cell: string, colIndex: number) => (
              <td>
                <Letter
                  key={`${rowIndex}-${colIndex}`}
                  text={cellsData[rowIndex][colIndex]}
                  isActive={isCellSelected({ row: rowIndex, col: colIndex })}
                  onMouseEnter={() =>
                    handleMouseEnter({ row: rowIndex, col: colIndex })
                  }
                  onMouseDown={() =>
                    handleMouseDown({ row: rowIndex, col: colIndex })
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default LettersGrid;
