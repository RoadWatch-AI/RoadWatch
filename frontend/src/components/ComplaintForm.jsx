import { useState } from "react";
import { Upload } from "lucide-react";

function ComplaintForm({
  lat,
  lon,
  setLat,
  setLon,
  refreshComplaints
}) {

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // =========================================================
  //                  HANDLE IMAGE UPLOAD
  // =========================================================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(file);

      setPreview(URL.createObjectURL(file));

    }

  };

  // =========================================================
  //                  HANDLE DRAG & DROP
  // =========================================================

  const handleDrop = (e) => {

    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {

      setImage(file);

      setPreview(URL.createObjectURL(file));

    }

  };

  // =========================================================
  //                  HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // =========================================================
      //          REVERSE GEOCODING USING OPENSTREETMAP
      // =========================================================

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      const locationData = await response.json();

      console.log(locationData);

      // ---------------- ROAD NAME ----------------

      const roadName =
        locationData.address.road ||
        locationData.address.suburb ||
        "Unknown Road";

      // ---------------- ROAD TYPE ----------------

      const roadType =
        locationData.type || "Unknown";

      // ---------------- AREA ----------------

      const area =
        locationData.address.suburb ||
        locationData.address.city ||
        locationData.address.town ||
        "Unknown Area";

      console.log("Road Name:", roadName);
      console.log("Road Type:", roadType);

      // =========================================================
      //                  CREATE FORM DATA
      // =========================================================

      const formData = new FormData();

      formData.append("lat", lat);

      formData.append("lon", lon);

      formData.append("road_name", roadName);

      formData.append("road_type", roadType);

      formData.append("area", area);

      formData.append("description", description);

      // ---------------- IMAGE ----------------

      if (image) {

        formData.append("image", image);

      }

      // =========================================================
      //                  SEND TO BACKEND
      // =========================================================

      const backendResponse = await fetch(
  "http://127.0.0.1:5000/complaints",
  {

    method: "POST",

    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },

    body: formData,

  }
);

      const data = await backendResponse.json();

      console.log(data);

      alert(
        `Complaint Submitted Successfully!\n\n`
      );
      refreshComplaints();

      // =========================================================
      //                  RESET FORM
      // =========================================================

      setDescription("");

      setImage(null);

      setPreview(null);

    }

    catch (error) {

      console.log(error);

      alert("Error submitting complaint");

    }

  };

  return (

    <div
      style={{
        width: "360px",
        background: "#ffffff",
        padding: "22px",
        borderRadius: "18px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        fontFamily: "Arial",
      }}
    >

      {/* =========================================================
                          HEADING
      ========================================================= */}

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>

  <h2
    style={{
      margin: 0,
      color: "#1e293b",
      fontSize: "32px",
    }}
  >
    Report Road Issue
  </h2>

  <button

    onClick={() => {

      setLat(null);

      setLon(null);

    }}

    style={{

      border: "none",

      background: "transparent",

      fontSize: "28px",

      cursor: "pointer",

      color: "#6b7280",

      fontWeight: "bold",

    }}

  >

    ×

  </button>

</div>

      {/* =========================================================
                      LOCATION STATUS
      ========================================================= */}

      <div
        style={{
          background: "#f1f5f9",
          padding: "12px",
          borderRadius: "12px",
          marginBottom: "18px",
          fontSize: "14px",
          color: "#0f172a",
          textAlign: "center",
          fontWeight: "500",
        }}
      >
        📍 Location Captured Successfully
      </div>

      {/* =========================================================
                          UPLOAD BOX
      ========================================================= */}

      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed #94a3b8",
          borderRadius: "14px",
          height: "180px",
          cursor: "pointer",
          marginBottom: "18px",
          background: "#f8fafc",
          overflow: "hidden",
          position: "relative",
        }}
      >

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* =========================================================
                        IMAGE PREVIEW
        ========================================================= */}

        {preview ? (

image?.type?.startsWith(
  "video"
) ? (

    <video
      src={preview}
      controls
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "12px",
      }}
    />

  ) : (

    <img
      src={preview}
      alt="Preview"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

  )

) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >

            <Upload size={40} color="#475569" />

            <p
              style={{
                marginTop: "10px",
                color: "#475569",
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              Upload Road Image/Video
            </p>

          </div>

        )}

      </label>

      {/* =========================================================
                          DESCRIPTION
      ========================================================= */}

      <textarea
        placeholder="Issue Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          resize: "none",
          outline: "none",
          marginBottom: "18px",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />

      {/* =========================================================
                        SUBMIT BUTTON
      ========================================================= */}

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background: "#ef4444",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Submit Complaint
      </button>

    </div>
  );
}

export default ComplaintForm;