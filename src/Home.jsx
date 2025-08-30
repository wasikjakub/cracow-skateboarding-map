import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import spots from "./spots.json";
import SpotDetails from "./SpotDetails";
import Footer from "./components/Footer";
import { initializeMap, createCustomIcon, addMarkersToMap } from "./utils/mapUtils";
import { logSpotView, logMapInteraction } from "./utils/analytics";

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#fdf5e6";

    if (document.getElementById("map")._leaflet_id) {
      return;
    }

    const map = initializeMap("map");
    const customIcon = createCustomIcon();
    
    // Track map initialization
    logMapInteraction('Initialize', 'Map Loaded');
    
    addMarkersToMap(map, spots, customIcon, (spot) => {
      setSelectedSpot(spot);
      // Track spot selection
      logSpotView(spot.name);
    });
  }, []);

  return (
    <div className="container">
      <h1 className="main-heading">
        Cracow skateboarding map
      </h1>
      <div
        id="map"
        className="map-container"
      />
      <div className="spot-details-wrapper">
        <SpotDetails spot={selectedSpot} />
      </div>
      <Footer />
    </div>
  );
}