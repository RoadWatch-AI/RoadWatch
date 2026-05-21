import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
  useMap
} from "react-leaflet";

import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import ComplaintForm from "./ComplaintForm";

// =========================================================
//                  SEVERITY MARKERS
// =========================================================

// HIGH Severity - Red Marker
const highIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// MEDIUM Severity - Orange Marker
const mediumIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// LOW Severity - Yellow Marker
const lowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// =========================================================
//              LIVE CURRENT LOCATION DOT
// =========================================================

const currentDotIcon = L.divIcon({

  className: "",

  html: `
    <div style="
      position: relative;
      width: 18px;
      height: 18px;
    ">

      <div style="
        position:absolute;
        width:18px;
        height:18px;
        background:#3b82f6;
        border-radius:50%;
        opacity:0.6;
        animation:pulse 1.2s infinite;
      "></div>

      <div style="
        position:absolute;
        width:18px;
        height:18px;
        background:#2563eb;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 40px rgba(37,99,235,0.9);
      "></div>

      <style>
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }

          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      </style>

    </div>
  `,

  iconSize: [18, 18],

  iconAnchor: [9, 9],

});

// =========================================================
//                  RECENTER MAP
// =========================================================

function RecenterMap({ location }) {

  const map = useMap();

  useEffect(() => {

    map.setView(location, 16);

  }, [location, map]);

  return null;
}

// =========================================================
//              CAPTURE MAP CLICK
// =========================================================

function LocationMarker({ setLat, setLon }) {

  useMapEvents({

    click(e) {

      setLat(e.latlng.lat);

      setLon(e.latlng.lng);

    },

  });

  return null;
}

// =========================================================
//                  MAIN COMPONENT
// =========================================================

function MapComponent() {

  // Selected complaint coordinates
  const [lat, setLat] = useState(null);

  const [lon, setLon] = useState(null);

  // User current location
  const [currentLocation, setCurrentLocation] =
    useState(null);

  // Backend complaints
  const [complaints, setComplaints] =
    useState([]);

  // =========================================================
  //              ROUTE PARAMS
  // =========================================================

  const location = useLocation();

  const params =
    new URLSearchParams(location.search);

  const focusedLat = params.get("lat");

  const focusedLon = params.get("lon");

  // =========================================================
  //              GET CURRENT LOCATION
  // =========================================================

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      () => {

        alert("Location access denied");

      }

    );

  }, []);

  // =========================================================
  //              FETCH COMPLAINTS
  // =========================================================

  const fetchComplaints = () => {

    fetch("http://127.0.0.1:5000/complaints")

      .then((res) => res.json())

      .then((data) => {

        const formatted = data.map((c) => ({

          ...c,

          icon:
            c.severity === "HIGH"
              ? highIcon
              : c.severity === "MEDIUM"
              ? mediumIcon
              : lowIcon,

        }));

        setComplaints(formatted);

      });

  };

  useEffect(() => {

    fetchComplaints();

  }, []);

  // =========================================================
  //                  LOADING SCREEN
  // =========================================================

  if (!currentLocation) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontFamily: "Arial",
        }}
      >
        Loading Map...
      </div>

    );

  }

  // =========================================================
  //                  MAP CENTER
  // =========================================================

  const mapCenter =

    focusedLat && focusedLon

      ? [
          parseFloat(focusedLat),
          parseFloat(focusedLon),
        ]

      : currentLocation;

  // =========================================================
  //                  MAIN UI
  // =========================================================

  return (

    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >

      {/* COMPLAINT FORM */}

      {lat && lon && (

        <ComplaintForm
          lat={lat}
          lon={lon}
          refreshComplaints={fetchComplaints}
        />

      )}

      <MapContainer
        center={mapCenter}
        zoom={16}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        {/* MAP TILES */}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* RECENTER */}

        <RecenterMap
          location={mapCenter}
        />

        {/* CLICK LOCATION */}

        <LocationMarker
          setLat={setLat}
          setLon={setLon}
        />

        {/* CURRENT LOCATION */}

        <Circle
          center={currentLocation}
          radius={120}
          pathOptions={{
            color: "#60a5fa",
            fillColor: "#93c5fd",
            fillOpacity: 0.2,
            weight: 1,
          }}
        />

        <Marker
          position={currentLocation}
          icon={currentDotIcon}
        >

          <Popup>
            Your Current Location
          </Popup>

        </Marker>

        {/* COMPLAINT MARKERS */}

        {complaints.map((c) => (

          <Marker
            key={c.id}
            position={[c.lat, c.lon]}
            icon={c.icon}
          >

            <Popup>

              <div style={{ width: "260px" }}>

                <h3>{c.road_name}</h3>

                <p>
                  <strong>Issue:</strong> {c.issue}
                </p>

                <p>
                  <strong>Severity:</strong> {c.severity}
                </p>

                <p>
                  <strong>Road Type:</strong> {c.road_type}
                </p>

                <p>
                  <strong>Contractor:</strong>
                  {c.contractor_name}
                </p>

                <p>
                  <strong>Authority:</strong>
                  {c.authority_name}
                </p>

                <p>
                  <strong>Budget Allocated:</strong>
                  ₹{c.allocated_budget}
                </p>

                <p>
                  <strong>Budget Spent:</strong>
                  ₹{c.spent_budget}
                </p>

                <p>
                  <strong>Description:</strong>
                  {c.description}
                </p>

                {c.image_url && (

                  <img
                     src={`http://127.0.0.1:5000/${c.image_url}`}
                    alt="Road Issue"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginTop: "10px",
                    }}
                  />

                )}

              </div>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>
  );
}

export default MapComponent;