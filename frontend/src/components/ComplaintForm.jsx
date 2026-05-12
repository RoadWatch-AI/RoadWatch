import { useState } from "react";
import { Upload } from "lucide-react";

function ComplaintForm({ lat, lon }) {

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle image upload
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(file);

      setPreview(URL.createObjectURL(file));

    }

  };

  // Handle drag & drop
  const handleDrop = (e) => {

    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {

      setImage(file);

      setPreview(URL.createObjectURL(file));

    }

  };

  // Handle submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // Reverse Geocoding using OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      const locationData = await response.json();

      console.log(locationData);

      // Extract Road Name
      const roadName =
        locationData.address.road ||
        locationData.address.suburb ||
        "Unknown Road";

      // Extract Road Type
      const roadType =
        locationData.type || "Unknown";

      console.log("Road Name:", roadName);
      console.log("Road Type:", roadType);

      // Send Complaint to Backend
      const backendResponse = await fetch(
        "http://127.0.0.1:5000/complaints",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            lat: lat,

            lon: lon,

            road_name: roadName,

            road_type: roadType,

            description: description,

            image_url: image ? image.name : null,

            issue: "Pending AI Detection",

            severity: "Pending",

          }),

        }
      );

      const data = await backendResponse.json();

      console.log(data);

      alert("Complaint Submitted Successfully!");

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

      {/* Heading */}
      <h2
        style={{
          marginBottom: "20px",
          color: "#1e293b",
          textAlign: "center",
          fontSize: "32px",
        }}
      >
        Report Road Issue
      </h2>

      {/* Location Status */}
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

      {/* Upload Box */}
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
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Show uploaded image */}
        {preview ? (

          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

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
              Upload Road Image
            </p>

          </div>

        )}

      </label>

      {/* Description */}
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

      {/* Submit Button */}
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