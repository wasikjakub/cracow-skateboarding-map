import React, { useState } from "react";
import { logEvent } from "./utils/analytics";

export default function SpotDetails({ spot }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!spot) {
    return (
      <div className="spot-details-placeholder">
        Choose a spot on map to view details
      </div>
    );
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % spot.images.length
    );
    // Track image navigation
    logEvent('Gallery', 'Next Image', spot.name);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + spot.images.length) % spot.images.length
    );
    // Track image navigation
    logEvent('Gallery', 'Previous Image', spot.name);
  };

  return (
    <div className="spot-details">
      <h2 className="spot-name">
        {spot.name}
      </h2>
      <p className="spot-note">
        {spot.note}
      </p>
      {spot.images && spot.images.length > 0 && (
        <div className="image-gallery">
          <button
            onClick={handlePreviousImage}
            className="gallery-nav-button prev"
          >
            &#8249;
          </button>
          <img
            src={spot.images[currentImageIndex]}
            alt={`${spot.name} ${currentImageIndex + 1}`}
            className="gallery-image"
          />
          <button
            onClick={handleNextImage}
            className="gallery-nav-button next"
          >
            &#8250;
          </button>
        </div>
      )}
      <div className="spot-meta">
        submitted by {spot.author} on {spot.date}
      </div>
    </div>
  );
}