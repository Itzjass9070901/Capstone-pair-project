import "./App.css";
import { GameCanvas } from "./components/GameCanvas";

function App() {
  return (
    <div className="app" style={{ background: "black", height: "100vh" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>Centipede</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GameCanvas />
      </div>
    </div>
  );
}

export default App;
