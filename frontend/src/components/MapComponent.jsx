import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";

import { useState, useEffect } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import ComplaintForm from "./ComplaintForm";

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

// Current User Location Marker - Blue
const currentLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Recenter map when location changes
function RecenterMap({ location }) {

  const map = useMap();

  useEffect(() => {

    map.setView(location, 13);

  }, [location, map]);

  return null;
}

// Capture clicked coordinates
function LocationMarker({ setLat, setLon }) {

  useMapEvents({

    click(e) {

      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      setLat(latitude);
      setLon(longitude);

    },

  });

  return null;
}

function MapComponent() {

  // Selected complaint coordinates
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  // Current user location
  const [currentLocation, setCurrentLocation] = useState(null);

  // Complaints from backend
  const [complaints, setComplaints] = useState([]);

  // Get current user location
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      (error) => {

        console.log(error);

        alert("Location access denied");

      }

    );

  }, []);

  // Fetch complaints from backend
  const fetchComplaints = () => {

    fetch("http://127.0.0.1:5000/complaints")
      .then((res) => res.json())
      .then((data) => {

        const formatted = data.map((c) => ({

          ...c,

          lat: c.lat,
          lon: c.lon,

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

  // Loading screen
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

  return (

    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >

      {/* Complaint Form */}
      {lat && lon && (
        <ComplaintForm lat={lat} lon={lon} />
      )}

      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter Map */}
        <RecenterMap location={currentLocation} />

        {/* Capture Click Coordinates */}
        <LocationMarker
          setLat={setLat}
          setLon={setLon}
        />

        {/* Current User Location */}
        <Marker
          position={currentLocation}
          icon={currentLocationIcon}
        >

          <Popup>
            📍 Your Current Location
          </Popup>

        </Marker>

        {/* Complaint Markers */}
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
          height: "140px",
          objectFit: "cover",
          borderRadius: "10px",
          marginTop: "10px"
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