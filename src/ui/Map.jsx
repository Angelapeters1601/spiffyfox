import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";

let DefaultIcon = L.divIcon({
  html: `<img src="${icon}" 
  style="width: 25px; height: 41px;" />`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  // Wilmington coordinates
  const position = [39.74595, -75.54659];

  return (
    <div className="w-full">
      <div className="spiffy-bg-medium container mx-auto rounded-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-cinzel spiffy-text-dark mb-4 text-4xl font-bold">
            Visit Us in Wilmington
          </h1>
          <p className="font-quicksand mx-auto max-w-2xl text-lg text-gray-200">
            Located in the heart of Wilmington, Delaware USA, we're easily
            accessible and ready to welcome you.
          </p>
        </div>

        <div className="relative rounded-2xl bg-transparent shadow-xl">
          {/* Subtle gradient border effect */}
          <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-amber-400 to-purple-500 opacity-20 blur-sm"></div>

          {/* Map container with 5% size reduction and scroll stability */}
          <div className="relative z-10 mx-auto h-80 w-[95%] scale-95 transform md:h-[475px]">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false} // Disabled for better UX
              wheelDebounceTime={100}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
              className="leaflet-container-custom"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="leaflet-tile-pane"
              />
              <Marker position={position}>
                <Popup>
                  <div className="font-quicksand">
                    <strong className="font-cinzel text-amber-600">
                      SpiffyFox Office
                    </strong>
                    <br />
                    1 Spiffyfox Way, premium plaza, DE 19809
                    <br />
                    <span className="text-sm text-gray-600">United States</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Subtle decorative elements */}
          <div className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
        </div>
      </div>

      <style jsx>{`
        .leaflet-container-custom {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
        }
        .leaflet-tile-pane {
          filter: saturate(1.1) contrast(1.1) brightness(0.9);
        }
        .leaflet-container-custom .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .leaflet-container-custom .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
};

export default Map;
