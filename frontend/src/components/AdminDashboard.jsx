import React, { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {

  const handleLogout = () => {

    localStorage.clear();

    window.location.reload();

  };

  // =================== STATES ===================

  const [complaintsData, setComplaintsData] =
    useState([]);

  const [zoneFilter, setZoneFilter] =
    useState("ALL");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // =================== FETCH DATA ===================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/complaints")

      .then((res) => res.json())

      .then((data) => {

        const formatted = data.map((c) => ({

          id: c.id,

          road: c.road_name,

          zone: c.area,

          issue: c.issue,

          severity: c.severity,

          status: c.status,

          contractor:
            c.contractor_name || "Not Assigned",

          anomalies:
            c.anomalies || [],  

          resolutionDays: 3,

        }));

        setComplaintsData(formatted);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // =================== STATS ===================

  const stats = {

    total: complaintsData.length,

    active: complaintsData.filter(
      (c) => c.status === "ACTIVE"
    ).length,

    resolved: complaintsData.filter(
      (c) => c.status === "RESOLVED"
    ).length,

    highSeverity: complaintsData.filter(
      (c) => c.severity === "HIGH"
    ).length,

  };

  // =================== FILTERED DATA ===================

  const filteredComplaints =
    complaintsData.filter((c) => {

      return (

        (zoneFilter === "ALL" ||
          c.zone === zoneFilter) &&

        (severityFilter === "ALL" ||
          c.severity === severityFilter) &&

        (statusFilter === "ALL" ||
          c.status === statusFilter)

      );

    });

  // =================== GRAPH DATA ===================

const zoneCounts = {};

complaintsData.forEach((c) => {

  if (zoneCounts[c.zone]) {

    zoneCounts[c.zone]++;

  } else {

    zoneCounts[c.zone] = 1;

  }

});

const zoneGraphData = Object.keys(
  zoneCounts
).map((zone) => ({

  zone,

  complaints: zoneCounts[zone],

}));

  const severityGraphData = [

    {
      name: "High",
      value:
        complaintsData.filter(
          (c) => c.severity === "HIGH"
        ).length,
    },

    {
      name: "Medium",
      value:
        complaintsData.filter(
          (c) => c.severity === "MEDIUM"
        ).length,
    },

    {
      name: "Low",
      value:
        complaintsData.filter(
          (c) => c.severity === "LOW"
        ).length,
    },

  ];

  const pieColors = [
    "#f44336",
    "#ff9800",
    "#4caf50",
  ];

  // =================== ANALYTICS ===================

  const avgResolution =

    complaintsData.length > 0

      ?

      (
        complaintsData.reduce(
          (sum, c) =>
            sum + c.resolutionDays,
          0
        ) / complaintsData.length
      ).toFixed(1)

      :

      0;

  const pendingZone =

  zoneGraphData.length > 0

    ?

    zoneGraphData.reduce((max, z) =>

      z.complaints > max.complaints
        ? z
        : max

    ).zone

    :

    "No Data";

  

  // =================== UI ===================

  return (

    <div style={pageStyle}>

      {/* HEADER */}

      <div
        style={{
          ...headerStyle,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >

        <div>

          <h1 style={titleStyle}>
            🚦 RoadWatch Admin Dashboard
          </h1>

          <p style={subtitleStyle}>
            Smart Road Complaint Monitoring System
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={logoutBtn}
        >
          Logout
        </button>

      </div>

      {/* STATS */}

      <div style={cardGrid}>

        <div
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #2196F3",
          }}
        >

          <h3 style={cardTitle}>
            Total Complaints
          </h3>

          <p style={cardValue}>
            {stats.total}
          </p>

        </div>

        <div
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #FF9800",
          }}
        >

          <h3 style={cardTitle}>
            Active Complaints
          </h3>

          <p style={cardValue}>
            {stats.active}
          </p>

        </div>

        <div
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #4CAF50",
          }}
        >

          <h3 style={cardTitle}>
            Resolved Complaints
          </h3>

          <p style={cardValue}>
            {stats.resolved}
          </p>

        </div>

        <div
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #F44336",
          }}
        >

          <h3 style={cardTitle}>
            High Severity
          </h3>

          <p style={cardValue}>
            {stats.highSeverity}
          </p>

        </div>

      </div>

      {/* ANALYTICS */}

      <div style={sectionCard}>

        <h2 style={sectionTitle}>
          🏢 Authority Analytics
        </h2>

        <div style={authorityGrid}>

          <div style={authorityCard}>

            <h3 style={smallTitle}>
              Avg Resolution Time
            </h3>

            <p style={bigValue}>
              {avgResolution} days
            </p>

          </div>

          

          <div style={authorityCard}>

            <h3 style={smallTitle}>
              Most Pending Zone
            </h3>

            <p style={bigValue}>
              {pendingZone}
            </p>

          </div>

        </div>

      </div>

      {/* GRAPHS */}

      <div style={graphGrid}>

        <div style={graphCard}>

          <h2 style={sectionTitle}>
            📍 Complaints per Zone
          </h2>

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <BarChart
              data={zoneGraphData}
            >

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="complaints"
                fill="#2196F3"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div style={graphCard}>

          <h2 style={sectionTitle}>
            ⚠️ Severity Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={280}
          >

            <PieChart>

              <Pie
                data={severityGraphData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >

                {severityGraphData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        pieColors[index]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT COMPLAINTS */}

      <div style={sectionCard}>

        <h2 style={sectionTitle}>
          📋 Recent Complaints
        </h2>

        {/* FILTERS */}

        <div style={filterBar}>

          <select
            style={filterSelect}
            value={zoneFilter}
            onChange={(e) =>
              setZoneFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Zones
            </option>

            <option value="Zone 1">
              Zone 1
            </option>

            <option value="Zone 2">
              Zone 2
            </option>

            <option value="Zone 3">
              Zone 3
            </option>

            <option value="Zone 4">
              Zone 4
            </option>

          </select>

          <select
            style={filterSelect}
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Severity
            </option>

            <option value="HIGH">
              HIGH
            </option>

            <option value="MEDIUM">
              MEDIUM
            </option>

            <option value="LOW">
              LOW
            </option>

          </select>

          <select
            style={filterSelect}
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="RESOLVED">
              RESOLVED
            </option>

          </select>

        </div>

        {/* TABLE */}

        <table style={tableStyle}>

          <thead>

            <tr style={tableHeader}>

              <th style={thStyle}>
                ID
              </th>

              <th style={thStyle}>
                Road
              </th>

              <th style={thStyle}>
                Zone
              </th>

              <th style={thStyle}>
                Issue
              </th>

              <th style={thStyle}>
                Severity
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Contractor
              </th>

              <th style={thStyle}>
                 AI Alerts
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.map(
              (row) => (

                <tr
                  key={row.id}
                  style={tableRow}
                >

                  <td style={tdStyle}>
                    {row.id}
                  </td>

                  <td style={tdStyle}>
                    {row.road}
                  </td>

                  <td style={tdStyle}>
                    {row.zone}
                  </td>

                  <td style={tdStyle}>
                    {row.issue}
                  </td>

                  <td style={tdStyle}>

                    <span
                      style={{
                        ...tagStyle,

                        background:

                          row.severity ===
                          "HIGH"

                            ?

                            "#f44336"

                            :

                            row.severity ===
                            "MEDIUM"

                            ?

                            "#ff9800"

                            :

                            "#4caf50",
                      }}
                    >

                      {row.severity}

                    </span>

                  </td>

                  <td style={tdStyle}>

                    <span
                      style={{
                        ...tagStyle,

                        background:

                          row.status ===
                          "ACTIVE"

                            ?

                            "#2196F3"

                            :

                            "#4caf50",
                      }}
                    >

                      {row.status}

                    </span>

                  </td>

                  <td style={tdStyle}>
                    {row.contractor}
                  </td>

                  <td style={tdStyle}>

  {

    row.anomalies.length > 0 ? (

      <details>

        <summary
          style={insightBtn}
        >

          View Alerts

        </summary>

        <div
          style={{
            marginTop: "10px",
          }}
        >

          {

            row.anomalies.map(
              (alert, index) => (

                <div
                  key={index}
                  style={anomalyStyle}
                >

                  ⚠️ {alert}

                </div>

              )
            )

          }

        </div>

      </details>

    ) : (

      <span
        style={{
          color: "#64748b",
          fontWeight: "500",
        }}
      >

        No Alerts

      </span>

    )

  }

</td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Dashboard;

// =================== STYLES ===================

const pageStyle = {
  padding: "25px",
  background:
    "linear-gradient(to right, #eef2f3, #ffffff)",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  marginBottom: "25px",
};

const titleStyle = {
  fontSize: "34px",
  fontWeight: "bold",
  color: "#222",
};

const subtitleStyle = {
  marginTop: "5px",
  fontSize: "16px",
  color: "#666",
};

const logoutBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "10px",
  background: "#f44336",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow:
    "0px 4px 12px rgba(0,0,0,0.15)",
};

const cardTitle = {
  fontSize: "16px",
  color: "#666",
  marginBottom: "10px",
};

const cardValue = {
  fontSize: "30px",
  fontWeight: "bold",
  color: "#222",
};

const sectionCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow:
    "0px 4px 12px rgba(0,0,0,0.15)",
  marginBottom: "30px",
  overflowX: "auto",
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
  color: "#222",
};

const graphGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const graphCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow:
    "0px 4px 12px rgba(0,0,0,0.15)",
};

const authorityGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
};

const authorityCard = {
  padding: "15px",
  borderRadius: "14px",
  background: "#f5f7ff",
  border: "1px solid #ddd",
};

const smallTitle = {
  fontSize: "15px",
  color: "#555",
};

const bigValue = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#222",
  marginTop: "8px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeader = {
  background: "#2196F3",
  color: "white",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tableRow = {
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  color: "#333",
};

const tagStyle = {
  padding: "6px 12px",
  borderRadius: "12px",
  color: "white",
  fontSize: "14px",
  fontWeight: "bold",
};

const filterBar = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  flexWrap: "wrap",
};

const filterSelect = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
};

const insightBtn = {

  background: "#1e3a8a",

  color: "white",

  padding: "8px 14px",

  borderRadius: "10px",

  cursor: "pointer",

  fontSize: "13px",

  fontWeight: "600",

  width: "fit-content",

  userSelect: "none",
};

const anomalyStyle = {

  background: "#fff7ed",

  color: "#c2410c",

  border: "1px solid #fdba74",

  padding: "8px 12px",

  borderRadius: "10px",

  fontSize: "12px",

  fontWeight: "600",

  marginBottom: "6px",

  width: "fit-content",
};