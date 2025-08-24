import { useState, useEffect } from "react";
import Home from "./Home";
import AddSpot from "./AddSpot";
import "@fontsource/ibm-plex-mono";
import "./styles/App.css";
import { initGA } from "./utils/analytics";

export default function App() {
  const [page, setPage] = useState("home");

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Track page changes
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-SFYJFF7F1X', {
        page_path: newPage === 'home' ? '/' : `/${newPage}`
      });
    }
  };

  return (
    <div>
      <nav className="nav">
        <button
          onClick={() => handlePageChange("home")}
          className="nav-button"
        >
          Map
        </button>
        <button
          onClick={() => handlePageChange("add")}
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