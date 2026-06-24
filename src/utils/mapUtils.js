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

// Create custom icon for markers (used for location picker in AddSpot)
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

const TYPE_COLORS = {
  Skatepark: '#3b82f6',
  Street:    '#f97316',
  DIY:       '#22c55e',
};

export const createColoredIcon = (type) => {
  const color = TYPE_COLORS[type] || '#6b7280';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="34" viewBox="0 0 22 34">
    <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 23 11 23s11-14.75 11-23C22 4.925 17.075 0 11 0z"
      fill="${color}" stroke="white" stroke-width="1.5"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [22, 34],
    iconAnchor: [11, 34],
    popupAnchor: [0, -34],
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

// Add markers to map, returns array of created markers
export const addMarkersToMap = (map, spots, onMarkerClick) => {
  const markers = [];
  spots.forEach((spot) => {
    const marker = L.marker(spot.coordinates, { icon: createColoredIcon(spot.type) })
      .addTo(map)
      .bindPopup(`<b>${spot.name}</b>`);

    if (onMarkerClick) {
      marker.on("click", () => onMarkerClick(spot));
    }
    markers.push(marker);
  });
  return markers;
};

// Clean up map
export const cleanupMap = (map) => {
  if (map) {
    map.off();
    map.remove();
  }
}; 