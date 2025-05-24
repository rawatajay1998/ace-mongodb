"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { Icon } from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Marker as LeafletMarker } from "leaflet";

interface Area {
  _id: string;
  name: string;
  areaImageUrl: string;
  cityId: string;
  slug: string;
  topLocation?: boolean;
  lat?: number;
  lng?: number;
}

function MapPanner({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  return null;
}

function MapInitializer({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map]);

  return null;
}

const customIcon: Icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function ClientOnlyMap({
  areas,
  activePosition,
  activeAreaId,
}: {
  areas: Area[];
  activePosition: [number, number] | null;
  activeAreaId: string | null;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    if (activeAreaId && markerRefs.current[activeAreaId]) {
      markerRefs.current[activeAreaId].openPopup();
    }
  }, [activeAreaId]);

  return (
    <div className="map-container" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[25.276987, 55.296249]}
        zoom={11}
        scrollWheelZoom={true}
        className="leaflet-container"
        style={{ height: "100%", width: "100%" }}
      >
        <MapInitializer
          onMapReady={(map) => {
            mapRef.current = map;
          }}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activePosition && <MapPanner position={activePosition} />}

        {areas
          .filter(
            (area) =>
              typeof area.lat === "number" && typeof area.lng === "number"
          )
          .map((area) => {
            const isActive = area._id === activeAreaId;

            return (
              <Marker
                key={area._id}
                position={[area.lat!, area.lng!]}
                icon={customIcon}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[area._id] = ref;

                    // Open popup after ref is available
                    if (isActive) {
                      setTimeout(() => {
                        ref.openPopup();
                      }, 0); // delay to ensure ref is mounted
                    }
                  }
                }}
              >
                <Popup>
                  <strong>{area.name}</strong>
                  <br />
                  City: {area.cityId}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
