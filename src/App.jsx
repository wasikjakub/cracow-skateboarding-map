import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import spots from "./spots.json";
import "./index.css";
import SpotDetails from "./SpotDetails";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "@fontsource/ibm-plex-mono";

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#fdf5e6";

    if (document.getElementById("map")._leaflet_id) {
      return;
    }

    const map = L.map("map").setView([50.0647, 19.945], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    spots.forEach((spot) => {
      const marker = L.marker(spot.coordinates, { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${spot.name}</b>`);

      marker.on("click", () => {
        setSelectedSpot(spot);
      });
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Ustawienie zawartości na górze
        alignItems: "center",
        minHeight: "100vh", // Minimalna wysokość na całą stronę
        backgroundColor: "#fdf5e6",
        overflow: "auto", // Umożliwia przewijanie, jeśli zawartość przekracza wysokość
        overflowX: "hidden",
      }}
    >
      <h1
        style={{
          marginBottom: "50px",
          fontSize: "4vw", // zamiast 80px, dopasowuje się do szerokości ekranu
          color: "#333",
          fontFamily: "'IBM Plex Mono', monospace",
          textAlign: "center",
        }}
      >
        Cracow skateboarding map
      </h1>
      <div
        id="map"
        style={{
          height: "650px",
          width: "750px",
          border: "2px solid black",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <SpotDetails spot={selectedSpot} />
      <footer
        style={{
          width: "100%",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          fontFamily: "'IBM Plex Mono', monospace",
          backgroundColor: "#fdf5e6",
        }}
      >
        made by{" "}
        <a
          href="https://www.instagram.com/kubifoczka/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#888",
            textDecoration: "none",
          }}
        >
          @kubifoczka
        </a>
      </footer>
    </div>
  );
}
