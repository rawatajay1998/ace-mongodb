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
  activeAreaName,
}: {
  areas: Area[];
  activePosition: [number, number] | null;
  activeAreaName: string | null;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker>>({});

  // Open popup when activeAreaName changes
  useEffect(() => {
    if (activeAreaName && markerRefs.current[activeAreaName]) {
      markerRefs.current[activeAreaName].openPopup();
    }
  }, [activeAreaName]);

  // Invalidate map size on position change (esp. mobile fix)
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 300);
  }, [activePosition]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[25.276987, 55.296249]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapInitializer onMapReady={(map) => (mapRef.current = map)} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activePosition && <MapPanner position={activePosition} />}

        {areas
          .filter(
            (area) =>
              typeof area.lat === "number" && typeof area.lng === "number"
          )
          .map((area) => {
            const isActive = area.name === activeAreaName;

            return (
              <Marker
                key={area.name}
                position={[area.lat!, area.lng!]}
                icon={customIcon}
                ref={(ref) => {
                  const marker = ref as unknown as LeafletMarker;
                  if (marker) {
                    markerRefs.current[area.name] = marker;
                    if (isActive) {
                      setTimeout(() => marker.openPopup(), 0);
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
