import LettersGrid from "@/components/word-search/LettersGrid";
import { generateGrid } from "@/util/GridFuncs";

function WordSearchGame() {
  return (
    <>
      <div>
        <LettersGrid cellsData={generateGrid({ row: 7, col: 7 })} />
      </div>
    </>
  );
}

export default WordSearchGame;
