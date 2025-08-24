import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { initializeMap, createCustomIcon, cleanupMap } from "./utils/mapUtils";
import { SPOT_TYPES, FORMSPREE_ENDPOINT, UPLOADCARE_PUBLIC_KEY } from "./constants/formOptions";
import { logFormSubmission, logMapInteraction } from "./utils/analytics";

export default function AddSpot() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
  const [type, setType] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState(null);

  // Load Uploadcare script
  useEffect(() => {
    if (!window.uploadcare) {
      const script = document.createElement('script');
      script.src = 'https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js';
      script.async = true;
      script.onload = () => {
        // nothing
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!window.uploadcare) return;
    const widget = window.uploadcare.Widget('#uploadcare-widget');
    widget.onChange(fileGroup => {
      if (!fileGroup) return;
      if (fileGroup.files) {
        fileGroup.files().done(files => {
          const urls = files.map(f => f.cdnUrl);
          setImages(urls);
        });
      } else {
        fileGroup.done(file => setImages([file.cdnUrl]));
      }
    });

    // Apply custom styling to Uploadcare button
    const applyUploadcareStyling = () => {
      const uploadcareElements = document.querySelectorAll('[class*="uploadcare"], [class*="ucare"], button[class*="upload"], button[class*="ucare"]');
      uploadcareElements.forEach(element => {
        element.style.backgroundColor = '#333';
        element.style.color = 'white';
        element.style.border = '2px solid #333';
        element.style.borderRadius = '4px';
        element.style.padding = '8px 16px';
        element.style.fontFamily = "'IBM Plex Mono', monospace";
        element.style.fontSize = '14px';
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.2s ease';
      });
    };

    // Apply styling immediately and also after a delay to catch dynamically created elements
    applyUploadcareStyling();
    setTimeout(applyUploadcareStyling, 1000);
    setTimeout(applyUploadcareStyling, 2000);
  }, []);

  useEffect(() => {
    const customIcon = createCustomIcon();
    const map = initializeMap("add-map");

    // Track map initialization for add spot
    logMapInteraction('Initialize', 'AddSpot Map');

    let marker;

    map.on("click", (e) => {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);

      // Track map clicks
      logMapInteraction('Click', 'Coordinate Selection');

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }
    });

    return () => {
      cleanupMap(map);
    };
  }, []);

  const handleFormSubmit = () => {
    const hiddenInput = document.querySelector('input[name="images"]');
    if (hiddenInput) {
      hiddenInput.value = images.join(', ');
    }
    
    // Track form submission
    logFormSubmission('AddSpot');
    
    setStatus("SUCCESS");
  };

  return (
    <div className="container">
      <h1 className="sub-heading">
       Submit your favourite spot
      </h1>
      <p className="description">
        Click on the map to set coordinates and fill in the details below to submit a new spot.
      </p>
      <div
        id="add-map"
        className="map-container"
      />
      <div className="form-wrapper">
        <form
          method="POST"
          action={FORMSPREE_ENDPOINT}
          target="hidden_iframe"
          onSubmit={handleFormSubmit}
          className="form"
        >
          <div className="form-group">
            <label className="form-label">Spot name: </label>
            <input 
              name="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Note: </label>
            <textarea 
              name="note" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              required 
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude: </label>
            <input
              name="lat"
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
              name="lng"
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
              name="type" 
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
              Images (optional):
            </label>
            <input
              type="hidden"
              role="uploadcare-uploader"
              data-public-key={UPLOADCARE_PUBLIC_KEY}
              data-multiple
              id="uploadcare-widget"
            />
            <input type="hidden" name="images" value={images.join(', ')} />
            {/* Thumbnails below */}
            <div className="image-thumbnails">
              {images && images.length > 0 &&
                images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`uploaded ${idx + 1}`}
                    className="image-thumbnail"
                  />
                ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Author: </label>
            <input 
              name="author" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              className="form-input"
            />
          </div>
          <button
            type="submit"
            className="form-button"
          >
            Submit
          </button>
          {status === "ERROR" && <p style={{ color: "red" }}>Oops! There was an error submitting the form.</p>}
        </form>
        <iframe name="hidden_iframe" style={{ display: "none" }}></iframe>
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