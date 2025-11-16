// Simple router setup
import "./App.css";
import { Routes, Route, Link } from 'react-router-dom'
import WordSearchGame from "./pages/WordSearchGame";
import NertsGame from "./pages/NertsGame";

function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>
        <Link to="/game">Play Word Search</Link>
      </p>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  )
}

function App() {
  return (
    <>
      <nav style={{ padding: 8 }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/game">Word Search</Link> |{' '}
        <Link to="/cards">Playing Cards</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<WordSearchGame />} />
        <Route path="/cards" element={NertsGame()} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
