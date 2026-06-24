import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { initializeMap, createCustomIcon, cleanupMap } from "./utils/mapUtils";
import { SPOT_TYPES, GAS_ENDPOINT } from "./constants/formOptions";
import { CITIES } from "./constants/cities";
import { logFormSubmission, logMapInteraction } from "./utils/analytics";

const MAX_FILES = 5;

export default function AddSpot() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [type, setType] = useState("");
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("Cracow");
  const [status, setStatus] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const cityConfig = CITIES.find(c => c.name === city);
    if (!mapRef.current) {
      const customIcon = createCustomIcon();
      mapRef.current = initializeMap("add-map", cityConfig.center, cityConfig.zoom);
      logMapInteraction('Initialize', 'AddSpot Map');
      let marker;
      mapRef.current.on("click", (e) => {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        logMapInteraction('Click', 'Coordinate Selection');
        if (marker) {
          marker.setLatLng(e.latlng);
        } else {
          marker = L.marker(e.latlng, { icon: customIcon }).addTo(mapRef.current);
        }
      });
    } else {
      mapRef.current.flyTo(cityConfig.center, cityConfig.zoom, { duration: 1 });
    }
  }, [city]);

  useEffect(() => {
    return () => {
      cleanupMap(mapRef.current);
      mapRef.current = null;
    };
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, MAX_FILES);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("LOADING");
    logFormSubmission("AddSpot");

    try {
      const imagePayloads = await Promise.all(
        files.map(f => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({
            name: f.name,
            base64: reader.result.split(",")[1],
            mimeType: f.type,
          });
          reader.onerror = reject;
          reader.readAsDataURL(f);
        }))
      );

      const payload = {
        name: name.trim(),
        note: note.trim(),
        lat: String(lat),
        lng: String(lng),
        type,
        city,
        author: author.trim() || "anonymous",
        images: imagePayloads,
      };

      const res = await fetch(GAS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        const text = await res.text();
        console.error("GAS returned non-JSON response:", text);
        setStatus("ERROR");
        return;
      }

      if (!result.ok) console.error("GAS error:", result.error);
      setStatus(result.ok ? "SUCCESS" : "ERROR");
    } catch (err) {
      console.error("Fetch failed:", err);
      setStatus("ERROR");
    }
  };

  return (
    <div className="container">
      <h1 className="sub-heading">
        Submit your favourite spot
      </h1>
      <p className="description">
        Click on the map to set coordinates and fill in the details below to submit a new spot.
      </p>
      <div className="city-tabs">
        {CITIES.map(c => (
          <button
            key={c.name}
            className={`city-tab${city === c.name ? " active" : ""}`}
            onClick={() => setCity(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div id="add-map" className="map-container" />
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Spot name: </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Note: </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude: </label>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              type="number"
              step="any"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude: </label>
            <input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              type="number"
              step="any"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Type: </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="form-select"
            >
              {SPOT_TYPES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Images (optional — max {MAX_FILES} files):
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="form-input"
            />
            <div className="image-thumbnails">
              {previews.map((url, idx) => (
                <img key={idx} src={url} alt={`preview ${idx + 1}`} className="image-thumbnail" />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Author: </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={status === "LOADING"}
            className="form-button"
          >
            {status === "LOADING" ? "Submitting…" : "Submit"}
          </button>
          {status === "ERROR" && (
            <p style={{ color: "red" }}>Oops! There was an error submitting the form.</p>
          )}
        </form>
      </div>

      <Modal
        isOpen={status === "SUCCESS"}
        onClose={() => setStatus(null)}
        title="Spot submitted successfully!"
        message="Thank you for your submission. We'll review it soon."
        buttonText="Close"
      />

      <Footer />
    </div>
  );
}
