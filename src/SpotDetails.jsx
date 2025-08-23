import React, { useState } from "react";

export default function SpotDetails({ spot }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!spot) {
    return (
      <div
        style={{
          marginTop: "5px",
          fontSize: "16px",
          color: "#555",
          fontFamily: "'IBM Plex Mono', monospace",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        Choose a spot on map to view details
      </div>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % spot.images.length
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + spot.images.length) % spot.images.length
    );
  };

  return (
    <div
      style={{
        marginTop: "5px",
        padding: "20px",
        fontFamily: "'IBM Plex Mono', monospace",
        width: "90%",
        maxWidth: "750px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "24px", marginBottom: "5px", color: "#333" }}>
        {spot.name}
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "#555",
          marginBottom:
            typeof window !== "undefined" && window.innerWidth < 600
              ? "-30vw"
              : "0px",
        }}
      >
        {spot.note}
      </p>
      {spot.images && spot.images.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "750px",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={handlePreviousImage}
            style={{
              position: "absolute",
              left: "10px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            &#8249;
          </button>
          <img
            src={spot.images[currentImageIndex]}
            alt={`${spot.name} ${currentImageIndex + 1}`}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              borderRadius: "8px",
            }}
          />
          <button
            onClick={handleNextImage}
            style={{
              position: "absolute",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}