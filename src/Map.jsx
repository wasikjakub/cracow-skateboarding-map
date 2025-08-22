import React, { useEffect } from "react";
import L from "leaflet";

export default function Map({ spots }) {
  useEffect(() => {
    const map = L.map("map").setView([50.06131, 19.915628], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    spots.forEach((spot) => {
      const marker = L.marker(spot.coordinates).addTo(map);
      marker.bindPopup(`<b>${spot.name}</b><br>${spot.note}`);
    });

    return () => {
      map.remove();
    };
  }, [spots]);

  return <div id="map" style={{ height: "650px", width: "750px" }} />;
}