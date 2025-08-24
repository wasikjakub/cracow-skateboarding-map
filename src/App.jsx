import { useState } from "react";
import Home from "./Home";
import AddSpot from "./AddSpot";
import "@fontsource/ibm-plex-mono";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "10px 0",
          backgroundColor: "#fdf5e6",
          zIndex: 1000,
          borderBottom: "2px solid #ccc",
        }}
      >
        <button
          onClick={() => setPage("home")}
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Map
        </button>
        <button
          onClick={() => setPage("add")}
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Add Spot
        </button>
      </nav>
      <div style={{ paddingTop: "60px" }}>
        {page === "home" && <Home />}
        {page === "add" && <AddSpot />}
      </div>
    </div>
  );
}