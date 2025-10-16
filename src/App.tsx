import "./App.css";
import LettersGrid from "./components/LettersGrid";
import { generateGrid } from "./util/GridFuncs";

function App() {
  return (
    <>
      <div>
        <LettersGrid cellsData={generateGrid({ row: 7, col: 7 })} />
      </div>
    </>
  );
}

export default App;
