import "./App.css";
import LettersGrid from "./components/LettersGrid";

function App() {
  const testGrid: string[][] = [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"],
  ];
  return (
    <>
      <div>
        <LettersGrid cellsData={testGrid} />
      </div>
    </>
  );
}

export default App;
