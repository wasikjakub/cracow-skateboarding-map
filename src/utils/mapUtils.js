import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

// Default map center (Krakow)
export const DEFAULT_CENTER = [50.0647, 19.945];
export const DEFAULT_ZOOM = 13;

// Create custom icon for markers
export const createCustomIcon = () => {
  return L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Initialize a basic map
export const initializeMap = (containerId, center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM) => {
  const map = L.map(containerId).setView(center, zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
};

// Add markers to map
export const addMarkersToMap = (map, spots, customIcon, onMarkerClick) => {
  spots.forEach((spot) => {
    const marker = L.marker(spot.coordinates, { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${spot.name}</b>`);

    if (onMarkerClick) {
      marker.on("click", () => onMarkerClick(spot));
    }
  });
};

// Clean up map
export const cleanupMap = (map) => {
  if (map) {
    map.off();
    map.remove();
  }
}; 