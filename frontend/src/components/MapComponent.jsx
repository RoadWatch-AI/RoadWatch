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

const highIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const mediumIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

function LocationMarker({

  setLat,
  setLon,
  selectedRoad,
  popupOpen

}) {

  useMapEvents({

    click(e) {

      // Disable map click if
      // popup OR transparency panel open

      if (selectedRoad || popupOpen) return;

      setLat(e.latlng.lat);

      setLon(e.latlng.lng);

    },

  });

  return null;
}

// =========================================================
//              ROAD TRANSPARENCY PANEL
// =========================================================

function TransparencyPanel({

  selectedRoad,
  setSelectedRoad

}) {

  const [activeTab, setActiveTab] =
    useState("details");

  const [repairHistory, setRepairHistory] =
  useState([]);

  const [maintenanceData, setMaintenanceData] =
  useState([]);

  useEffect(() => {

  if (!selectedRoad) return;

  // ---------------- REPAIR HISTORY ----------------

  fetch(

    `https://roadwatch-backend-2umx.onrender.com/repair-history/${selectedRoad.id}`

  )

    .then((res) => res.json())

    .then((data) => {

      setRepairHistory(data);

    });

  // ---------------- MAINTENANCE ----------------

  fetch(

    `https://roadwatch-backend-2umx.onrender.com/maintenance/${selectedRoad.id}`

  )

    .then((res) => res.json())

    .then((data) => {

      setMaintenanceData(data);

    });

}, [selectedRoad]);


  if (!selectedRoad) return null;

  const tabStyle = (tab) => ({
    flex: 1,
    padding: "10px 12px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s",
    background:
      activeTab === tab
        ? "#2563eb"
        : "#f3f4f6",
    color:
      activeTab === tab
        ? "white"
        : "#111827",
  });

  return (

    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "390px",
        height: "85vh",
        background: "white",
        borderRadius: "22px",
        boxShadow:
          "0 10px 35px rgba(0,0,0,0.18)",
        zIndex: 1000,
        padding: "22px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >

        <h2
          style={{
            margin: 0,
            fontSize: "30px",
            color: "#0f172a",
          }}
        >
          Road Transparency
        </h2>

        <button
          onClick={() =>
            setSelectedRoad(null)
          }
          style={{
            border: "none",
            background: "transparent",
            fontSize: "26px",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          ×
        </button>

      </div>

      {/* ROAD NAME */}

      <h3
        style={{
          marginBottom: "16px",
          color: "#111827",
        }}
      >
        {selectedRoad.road_name}
      </h3>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "18px",
        }}
      >

        <button
          style={tabStyle("details")}
          onClick={() =>
            setActiveTab("details")
          }
        >
          Details
        </button>

        <button
          style={tabStyle("history")}
          onClick={() =>
            setActiveTab("history")
          }
        >
          History
        </button>

        <button
          style={tabStyle("maintenance")}
          onClick={() =>
            setActiveTab("maintenance")
          }
        >
          Maintenance
        </button>

      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >

        {/* DETAILS TAB */}

        {activeTab === "details" && (

          <div
            style={{
              background: "#eff6ff",
              padding: "18px",
              borderRadius: "18px",
              lineHeight: "1.8",
            }}
          >

            <p style={{ marginBottom: "10px" }}>
              <strong>Authority:</strong>{" "}
              {selectedRoad.authority_name ||
                "Not Assigned"}
            </p>

            <p style={{ marginBottom: "10px" }}>
              <strong>Contractor:</strong>{" "}
              {selectedRoad.contractor_name ||
                "Not Assigned"}
            </p>

            <p style={{ marginBottom: "10px" }}>
              <strong>Budget Allocated:</strong>{" "}
              ₹{selectedRoad.allocated_budget || 0}
            </p>

            <p style={{ marginBottom: "10px" }}>
              <strong>Budget Spent:</strong>{" "}
              ₹{selectedRoad.spent_budget || 0}
            </p>

            <p style={{ marginBottom: "10px" }}>
              <strong>Funding Source:</strong>{" "}
              GCC Road Fund
            </p>

            <p style={{ marginBottom: "10px" }}>
              <strong>Last Repaired:</strong>{" "}
              12 Jan 2025
            </p>

            

          </div>

        )}

        {/* HISTORY TAB */}
{activeTab === "history" && (

  <div>

    {repairHistory.length === 0 ? (

      <p>No repair history found.</p>

    ) : (

      repairHistory.map((repair) => (

        <div
          key={repair.id}
          style={{
            background: "#eff6ff",
            padding: "18px",
            borderRadius: "18px",
            marginBottom: "14px",
            lineHeight: "1.8",
            border: "1px solid #bfdbfe",
          }}
        >

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              repair.repair_date
            ).toLocaleDateString()}
          </p>

          <p>
  <strong>Repair Type:</strong>{" "}
  {repair.repair_type}
</p>

          <p>
            <strong>Contractor:</strong>{" "}
            {repair.repaired_by}
          </p>

          <p>
            <strong>Cost:</strong> ₹
            {repair.repair_cost}
          </p>

          <p
            style={{
              color: "#16a34a",
              fontWeight: "bold",
            }}
          >
            Completed
          </p>

        </div>

      ))

    )}

  </div>

)}

        {/* MAINTENANCE TAB */}

       
{activeTab === "maintenance" && (

  <div>

    {maintenanceData.length === 0 ? (

      <p>No maintenance schedules.</p>

    ) : (

      maintenanceData.map((m) => (

        <div
          key={m.id}
          style={{
            background: "#eff6ff",
            padding: "18px",
            borderRadius: "18px",
            marginBottom: "14px",
            lineHeight: "1.8",
            border: "1px solid #bfdbfe",
          }}
        >

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              m.scheduled_date
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Maintenance:</strong>{" "}
            {m.maintenance_type}
          </p>

          <p
            style={{
              color:
                m.status === "COMPLETED"
                  ? "#16a34a"
                  : m.status === "PLANNED"
                  ? "#2563eb"
                  : "#d97706",

              fontWeight: "bold",
            }}
          >
            {m.status}
          </p>

        </div>

      ))

    )}

  </div>

)}

      </div>

    </div>

  );
}

// =========================================================
//              SIMPLE POPUP
// =========================================================

function ComplaintPopup({

  complaint,
  setSelectedRoad,
  setLat,
  setLon,
  setPopupOpen

}) {

  const [previewImage, setPreviewImage] =
      useState(null);

  return (

    <>

      <div
        style={{
          width: "270px",
          fontFamily: "Arial, sans-serif",
        }}
      >

        {/* TITLE */}

        <h3
          style={{
            marginBottom: "16px",
            color: "#111827",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {complaint.road_name}
        </h3>

        {/* ROAD TYPE */}

        <p
          style={{
            marginBottom: "6px",
            lineHeight: "0.8",
            fontSize: "16px",
          }}
        >

          <strong
            style={{
              color: "#111827",
            }}
          >
            Road Type:
          </strong>{" "}

          <span
            style={{
              color: "#1e293b",
              fontWeight: "500",
            }}
          >
            {complaint.road_type}
          </span>

        </p>

        {/* ISSUE */}

        <p
          style={{
            marginBottom: "6px",
            lineHeight: "0.8",
            fontSize: "16px",
          }}
        >

          <strong
            style={{
              color: "#111827",
            }}
          >
            Issue:
          </strong>{" "}

          <span
            style={{
              color: "#1e293b",
              fontWeight: "500",
            }}
          >
            {complaint.issue}
          </span>

        </p>

        {/* SEVERITY */}

        <p
          style={{
            marginBottom: "6px",
            lineHeight: "0.8",
            fontSize: "16px",
          }}
        >

          <strong
            style={{
              color: "#111827",
            }}
          >
            Severity:
          </strong>{" "}

          <span
            style={{
              color:
                complaint.severity === "HIGH"
                  ? "#dc2626"
                  : complaint.severity === "MEDIUM"
                  ? "#d97706"
                  : "#16a34a",

              fontWeight: "700",
            }}
          >

            {complaint.severity}

          </span>

        </p>

        {/* AUTHORITY */}

        <p
  style={{
    marginBottom: "12px",
    lineHeight: "1.3",
    fontSize: "16px",
  }}
>

          <strong
            style={{
              color: "#111827",
            }}
          >
            Assigned Authority:
          </strong>{" "}

          <span
            style={{
              color: "#1e293b",
              fontWeight: "500",
            }}
          >

            {complaint.authority_name ||
              "Not Assigned"}

          </span>

        </p>

        {/* DESCRIPTION */}

        <p
          style={{
            marginBottom: "10px",
            lineHeight: "0.8",
            fontSize: "16px",
          }}
        >

          <strong
            style={{
              color: "#111827",
            }}
          >
            Description:
          </strong>{" "}

          <span
            style={{
              color: "#1e293b",
              fontWeight: "500",
            }}
          >

            {complaint.description}

          </span>

        </p>

        {/* IMAGE */}
        {complaint.image_url && (

  complaint.media_type ===
  "video" ? (

    <video
      controls
      style={{
        width: "100%",
        height: "170px",
        borderRadius: "14px",
        marginTop: "4px",
      }}
    >

      <source
        src={`https://roadwatch-backend-2umx.onrender.com/${complaint.image_url}`}
      />

    </video>

  ) : (

    <img
      src={`https://roadwatch-backend-2umx.onrender.com/${complaint.image_url}`}
      alt="Road"

      onClick={() =>
        setPreviewImage(
          `https://roadwatch-backend-2umx.onrender.com/${complaint.image_url}`
        )
      }

      style={{
        width: "100%",
        height: "170px",
        objectFit: "cover",
        borderRadius: "14px",
        marginTop: "4px",
        cursor: "pointer",
      }}
    />

  )

)}

        {/* BUTTON */}

        <button

          onClick={() => {

            setLat(null);

            setLon(null);

            setPopupOpen(false);

            setSelectedRoad(complaint);

          }}

          style={{

            width: "100%",

            marginTop: "14px",

            padding: "12px",

            border: "none",

            borderRadius: "14px",

            background: "#2563eb",

            color: "white",

            fontWeight: "700",

            cursor: "pointer",

            fontSize: "14px",

          }}

        >

          View Road Transparency →

        </button>

      </div>

      {/* IMAGE PREVIEW */}

      {previewImage && (

        <div

          onClick={() =>
            setPreviewImage(null)
          }

          style={{

            position: "fixed",

            top: 0,

            left: 0,

            width: "100vw",

            height: "100vh",

            background:
              "rgba(0,0,0,0.75)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            zIndex: 9999,

            cursor: "pointer",

          }}
        >

          <img
            src={previewImage}
            alt="Preview"

            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "16px",
            }}
          />

        </div>

      )}

    </>

  );

}



// =========================================================
//                  MAIN COMPONENT
// =========================================================

function MapComponent({isAuthorityView = false}) {

  

  const [lat, setLat] = useState(null);

  const [lon, setLon] = useState(null);

  const [popupOpen, setPopupOpen] =
  useState(false);

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [selectedRoad, setSelectedRoad] =
    useState(null);

  const location = useLocation();

  const params =
    new URLSearchParams(location.search);

  const focusedLat = params.get("lat");

  const focusedLon = params.get("lon");

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

  const fetchComplaints = () => {

    fetch("https://roadwatch-backend-2umx.onrender.com/complaints")

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

  const mapCenter =

    focusedLat && focusedLon

      ? [
          parseFloat(focusedLat),
          parseFloat(focusedLon),
        ]

      : currentLocation;

  return (

    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >

      {/* TRANSPARENCY PANEL */}

      <TransparencyPanel
        selectedRoad={selectedRoad}
        setSelectedRoad={setSelectedRoad}
      />

      {/* COMPLAINT FORM */}

      {lat && lon && !isAuthorityView && (

      <ComplaintForm
       lat={lat}
       lon={lon}
       setLat={setLat}
       setLon={setLon}
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

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap
          location={mapCenter}
        />

        <LocationMarker
            setLat={setLat}
            setLon={setLon}
            selectedRoad={selectedRoad}
            popupOpen={popupOpen}
        />

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

        {complaints

.filter(
  (c) => c.status !== "RESOLVED"
)

.map((c) => (

          <Marker
            key={c.id}
            position={[c.lat, c.lon]}
            icon={c.icon}
          >

            <Popup
  maxWidth={320}
  eventHandlers={{
    add: () => setPopupOpen(true),
    remove: () => setPopupOpen(false),
  }}
>

              <ComplaintPopup
  complaint={c}
  setSelectedRoad={setSelectedRoad}
  setLat={setLat}
  setLon={setLon}
  setPopupOpen={setPopupOpen}
/>

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  );
}

export default MapComponent;