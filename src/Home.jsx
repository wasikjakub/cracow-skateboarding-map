import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import spots from "./spots.json";
import SpotDetails from "./SpotDetails";
import Footer from "./components/Footer";
import { initializeMap, createCustomIcon, addMarkersToMap, cleanupMap } from "./utils/mapUtils";
import { logSpotView, logMapInteraction } from "./utils/analytics";
import { CITIES } from "./constants/cities";

const TYPES = ["All", "Skatepark", "Street", "DIY"];

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Cracow");
  const [typeFilter, setTypeFilter] = useState("All");
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const prevCityRef = useRef(null);

  useEffect(() => {
    const city = CITIES.find(c => c.name === selectedCity);

    if (!mapRef.current) {
      mapRef.current = initializeMap("map", city.center, city.zoom);
      logMapInteraction('Initialize', 'Map Loaded');
    } else if (prevCityRef.current !== selectedCity) {
      mapRef.current.flyTo(city.center, city.zoom, { duration: 1 });
    }
    prevCityRef.current = selectedCity;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const customIcon = createCustomIcon();
    const filteredSpots = spots.filter(s =>
      (selectedCity === "All Poland" || s.city === selectedCity) &&
      (typeFilter === "All" || s.type === typeFilter)
    );

    markersRef.current = addMarkersToMap(mapRef.current, filteredSpots, customIcon, (spot) => {
      setSelectedSpot(spot);
      logSpotView(spot.name);
    });

    setSelectedSpot(null);
  }, [selectedCity, typeFilter]);

  useEffect(() => {
    return () => {
      cleanupMap(mapRef.current);
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="container">
      <h1 className="main-heading">Polish skateboarding map</h1>
      <div className="city-tabs">
        {CITIES.map(c => (
          <button
            key={c.name}
            className={`city-tab${selectedCity === c.name ? ' active' : ''}`}
            onClick={() => setSelectedCity(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <span className="filter-label">type:</span>
        {TYPES.map(t => (
          <button
            key={t}
            className={`filter-tab${typeFilter === t ? ' active' : ''}`}
            onClick={() => setTypeFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
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
