import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import spots from "./spots.json";
import SpotDetails from "./SpotDetails";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

export default function Home() {
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
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fdf5e6",
        overflow: "auto",
        overflowX: "hidden",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          fontSize: "5vw",
          color: "#333",
          textAlign: "center",
        }}
      >
        Cracow skateboarding map
      </h1>
      <div
        id="map"
        style={{
          height: "60vh",
          width: "90%",
          maxWidth: "750px",
          border: "2px solid black",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
      <div>
        <SpotDetails spot={selectedSpot} />
        {selectedSpot && (
          <div
            style={{
              marginTop: "-5vh",
              marginBottom: "30px",
              fontSize: "0.9em",
              color: "#666",
              textAlign: "center",
            }}
          >
            submitted by {selectedSpot.author} on {selectedSpot.date}
          </div>
        )}
      </div>
      <footer
        style={{
          width: "100%",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          backgroundColor: "#fdf5e6",
        }}
      >
        for skaters, by skaters - made by{" "}
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