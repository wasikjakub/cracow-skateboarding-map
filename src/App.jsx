import { useState } from "react";
import Home from "./Home";
import AddSpot from "./AddSpot";
import "@fontsource/ibm-plex-mono";
import "./styles/App.css";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <nav className="nav">
        <button
          onClick={() => setPage("home")}
          className="nav-button"
        >
          Map
        </button>
        <button
          onClick={() => setPage("add")}
          className="nav-button"
        >
          Add Spot
        </button>
      </nav>
      <div className="page-container">
        {page === "home" && <Home />}
        {page === "add" && <AddSpot />}
      </div>
    </div>
  );
}