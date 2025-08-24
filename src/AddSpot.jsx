import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#fdf5e6",
  overflow: "auto",
  overflowX: "hidden",
};

const headingStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontWeight: "bold",
  fontSize: "5vw",
  marginBottom: "30px",
  color: "#333",
  textAlign: "center",
};

const mapStyle = {
  height: "60vh",
  width: "90%",
  maxWidth: "750px",
  border: "2px solid black",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  marginBottom: "20px",
};

const formWrapperStyle = {
  width: "90%",
  maxWidth: "500px",
  margin: "0 auto",
};

export default function AddSpot() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
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
  }, []);
  const [type, setType] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fix leaflet's default icon path issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
    });

    const customIcon = L.icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const map = L.map("add-map").setView([50.0647, 19.945], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker;

    map.on("click", (e) => {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }
    });

    return () => {
      map.off();
      map.remove();
    };
  }, []);

  const handleFormSubmit = (e) => {
    const hiddenInput = document.querySelector('input[name="images"]');
    if (hiddenInput) {
      hiddenInput.value = images.join(', ');
    }
    setStatus("SUCCESS");
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>
       Submit your favourite spot
      </h1>
      <p style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.2em", color: "#444" }}>
        Click on the map to set coordinates and fill in the details below to submit a new spot.
      </p>
      <div
        id="add-map"
        style={mapStyle}
      />
      <div
        style={{
          ...formWrapperStyle,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form
          method="POST"
          action="https://formspree.io/f/mkgvwbnw"
          target="hidden_iframe"
          onSubmit={handleFormSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Spot name: </label>
            <input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Note: </label>
            <textarea name="note" value={note} onChange={(e) => setNote(e.target.value)} required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Latitude: </label>
            <input
              name="lat"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              type="number"
              step="any"
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Longitude: </label>
            <input
              name="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              type="number"
              step="any"
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Type: </label>
            <select name="type" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="">Select type</option>
              <option value="Skatepark">Skatepark</option>
              <option value="Street">Street</option>
              <option value="DIY">DIY</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>
              Images (optional):
            </label>
            <input
              type="hidden"
              role="uploadcare-uploader"
              data-public-key="9ec3c18363d778e9556b"
              data-multiple
              id="uploadcare-widget"
            />
            <input type="hidden" name="images" value={images.join(', ')} />
            {/* Thumbnails below */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              {images && images.length > 0 &&
                images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`uploaded ${idx + 1}`}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ color: "black", textAlign: "center", width: "100%" }}>Author: </label>
            <input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <button
            type="submit"
            style={{
              marginTop: "10px",
              outline: "none",
              border: "none",
            }}
          >
            Submit
          </button>
          {status === "ERROR" && <p style={{ color: "red" }}>Oops! There was an error submitting the form.</p>}
        </form>
        <iframe name="hidden_iframe" style={{ display: "none" }}></iframe>
      </div>
      {/* Modal for success */}
      {status === "SUCCESS" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
              padding: "2.5em 2em 1.5em 2em",
              minWidth: "300px",
              maxWidth: "90vw",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ fontSize: "1.4em", fontWeight: "bold", marginBottom: "1em", color: "#333" }}>
              Spot submitted successfully!
            </div>
            <div style={{ marginBottom: "1.5em", color: "#444" }}>
              Thank you for your submission. We'll review it soon.
            </div>
            <button
              onClick={() => setStatus(null)}
              style={{
                padding: "0.5em 1.5em",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1em",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
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
          style={{ color: "#888", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          @kubifoczka
        </a>
      </footer>
    </div>
  );
}