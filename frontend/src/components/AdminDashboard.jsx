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

  // ================= STATES =================

  const [complaintsData, setComplaintsData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [zoneFilter, setZoneFilter] =
    useState("ALL");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ================= FETCH =================

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

          createdAt: c.created_at,
          resolvedAt: c.resolved_at,

        }));

        setComplaintsData(formatted);

        setLoading(false);

      })

      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

  // ================= LOADING =================

  if (loading) {

    return (

      <div style={pageStyle}>

        <h2>
          Loading analytics...
        </h2>

      </div>

    );

  }

  // ================= FILTERS =================

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

  // ================= STATS =================

  const stats = {

    total: filteredComplaints.length,

    active: filteredComplaints.filter(
      (c) => c.status === "ACTIVE"
    ).length,

    resolved: filteredComplaints.filter(
      (c) => c.status === "RESOLVED"
    ).length,

    highSeverity: filteredComplaints.filter(
      (c) => c.severity === "HIGH"
    ).length,

  };

  // ================= ZONE GRAPH =================

  const zoneCounts = {};

  filteredComplaints.forEach((c) => {

    if (zoneCounts[c.zone]) {

      zoneCounts[c.zone]++;

    } else {

      zoneCounts[c.zone] = 1;

    }

  });

  const zoneGraphData =
    Object.keys(zoneCounts).map((zone) => ({

      zone,

      complaints:
        zoneCounts[zone],

    }));

  // ================= SEVERITY GRAPH =================

  const severityGraphData = [

    {
      name: "High",

      value:
        filteredComplaints.filter(
          (c) =>
            c.severity === "HIGH"
        ).length,
    },

    {
      name: "Medium",

      value:
        filteredComplaints.filter(
          (c) =>
            c.severity === "MEDIUM"
        ).length,
    },

    {
      name: "Low",

      value:
        filteredComplaints.filter(
          (c) =>
            c.severity === "LOW"
        ).length,
    },

  ];

  const pieColors = [
     
  "#ef4444",
  "#f59e0b",
  "#eab308",
];
  

  // ================= ANALYTICS =================

const resolvedComplaints =

  filteredComplaints.filter(

    (c) =>

      c.status === "RESOLVED" &&

      c.createdAt &&

      c.resolvedAt

  );

const avgResolution =

  resolvedComplaints.length > 0

    ?

    (

      resolvedComplaints.reduce(

        (sum, c) => {

          const created = new Date(
            c.createdAt
          );

          const resolved = new Date(
            c.resolvedAt
          );

          const diffDays =

            (resolved - created) /

            (1000 * 60 * 60 * 24);

          return sum + diffDays;

        },

        0

      ) /

      resolvedComplaints.length

    ).toFixed(1)

    :

    0;

  const activeComplaints =
  filteredComplaints.filter(
    (c) => c.status === "ACTIVE"
  );

   const pendingZoneCounts = {};

   activeComplaints.forEach((c) => {

     if (pendingZoneCounts[c.zone]) {

    pendingZoneCounts[c.zone]++;

  }  else {

    pendingZoneCounts[c.zone] = 1;

  }

});

   const pendingZone =

  Object.keys(pendingZoneCounts)
    .length > 0

    ?

    Object.keys(
      pendingZoneCounts
    ).reduce((a, b) =>

      pendingZoneCounts[a] >
      pendingZoneCounts[b]

        ?

        a

        :

        b

    )

    :

    "No Pending Complaints";
  // ================= UI =================

  return (

    <div style={pageStyle}>

      {/* HEADER */}

      <div style={headerStyle}>

        <div>

          <h1 style={titleStyle}>
            🚦 RoadWatch Admin Dashboard
          </h1>

          <p style={subtitleStyle}>
            Smart Road Complaint Monitoring System
          </p>

          <p style={dateStyle}>
            {new Date().toLocaleString()}
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={logoutBtn}
          onMouseEnter={(e) =>
  e.currentTarget.style.opacity = "0.9"
}

onMouseLeave={(e) =>
  e.currentTarget.style.opacity = "1"
}
        >
          Logout
        </button>

      </div>

      {/* KPI CARDS */}

      <div style={cardGrid}>

        <div
          
           onMouseEnter={(e) =>
    e.currentTarget.style.transform =
      "translateY(-4px)"
  }

  onMouseLeave={(e) =>
    e.currentTarget.style.transform =
      "translateY(0px)"
  }
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #3b82f6",
          }}
        >

          <h3 style={cardTitle}>
            📍 Total Complaints
          </h3>

          <p style={cardValue}>
            {stats.total}
          </p>

        </div>

        <div

           onMouseEnter={(e) =>
    e.currentTarget.style.transform =
      "translateY(-4px)"
  }

  onMouseLeave={(e) =>
    e.currentTarget.style.transform =
      "translateY(0px)"
  }
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #f59e0b",
          }}
        >

          <h3 style={cardTitle}>
            ⚠️ Active Complaints
          </h3>

          <p style={cardValue}>
            {stats.active}
          </p>

        </div>

        <div

           onMouseEnter={(e) =>
    e.currentTarget.style.transform =
      "translateY(-4px)"
  }

  onMouseLeave={(e) =>
    e.currentTarget.style.transform =
      "translateY(0px)"
  }
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #22c55e",
          }}
        >

          <h3 style={cardTitle}>
            ✅ Resolved Complaints
          </h3>

          <p style={cardValue}>
            {stats.resolved}
          </p>

        </div>

        <div

           onMouseEnter={(e) =>
    e.currentTarget.style.transform =
      "translateY(-4px)"
  }

  onMouseLeave={(e) =>
    e.currentTarget.style.transform =
      "translateY(0px)"
  }
          style={{
            ...cardStyle,
            borderLeft:
              "6px solid #ef4444",
          }}
        >

          <h3 style={cardTitle}>
            🚨 High Severity
          </h3>

          <p style={cardValue}>
            {stats.highSeverity}
          </p>

        </div>

      </div>

      {/* CITY MAP */}

      <div style={sectionCard}>

        <h2 style={sectionTitle}>
          🗺️ City Monitoring Map
        </h2>

        <div
  style={{

    display: "flex",

    gap: "14px",

    marginBottom: "15px",

    fontWeight: "600",

    color: "#475569",

    flexWrap: "wrap",

  }}
>

  <span>🔴 HIGH</span>

  <span>🟠 MEDIUM</span>

  <span>🟡 LOW</span>

</div>

        <div
          style={{
            height: "500px",
            borderRadius: "18px",
            overflow: "hidden",

            boxShadow:
  "0px 4px 14px rgba(0,0,0,0.12)",
          }}
        >

          <iframe
            title="roadwatch-map"
            src="http://localhost:3000/map"
            width="100%"
            height="100%"
            style={{
              border: "none",
            }}
          />

        </div>

      </div>

      {/* ANALYTICS */}

      <div style={sectionCard}>

        <h2 style={sectionTitle}>
          📊 Authority Analytics
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

      {/* CONTRACTOR PERFORMANCE */}

      <div style={sectionCard}>

        <h2 style={sectionTitle}>
          🏆 Contractor Performance
        </h2>

        <div style={authorityGrid}>

          <div style={authorityCard}>

            <h3 style={smallTitle}>
              Best Contractor
            </h3>

<p style={bigValue}>

{

  filteredComplaints.filter(

    (c) =>

      c.contractor !==
      "Not Assigned"

  ).length > 0

    ?

    filteredComplaints.find(

      (c) =>

        c.contractor !==
        "Not Assigned"

    ).contractor

    :

    "No Data"

}

</p>

          </div>

          <div style={authorityCard}>

            <h3 style={smallTitle}>
              Most Delayed Contractor
            </h3>

            <p style={bigValue}>
 {

  activeComplaints.filter(

    (c) =>

      c.contractor !==
      "Not Assigned"

  ).length > 0

    ?

    activeComplaints.find(

      (c) =>

        c.contractor !==
        "Not Assigned"

    ).contractor

    :

    "No Delays"

}
</p>

          </div>

        </div>

      </div>

      {/* CHARTS */}

      <div style={graphGrid}>

        <div style={graphCard}>

          <h2 style={sectionTitle}>
            📍 Complaints by Authority
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={zoneGraphData}
            >

              <XAxis dataKey="zone" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="complaints"
                fill="#3b82f6"
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
            height={300}
          >

            <PieChart>

              <Pie
                data={severityGraphData}
                dataKey="value"
                nameKey="name"
                 cx="50%"
                 cy="45%"
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
              All Authorities
            </option>

           {

  [

    ...new Set(

      complaintsData.map(
        (c) => c.zone
      )

    ),

  ].map((zone) => (

    <option
      key={zone}
      value={zone}
    >

      {zone}

    </option>

  ))

}
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

            <option value="IN_PROGRESS">
              IN_PROGRESS
            </option>

            <option value="RESOLVED">
              RESOLVED
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div
          style={{
            overflowX: "auto",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >

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
                  AI Insights
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredComplaints.map(
                (row) => (

                  <tr
                    key={row.id}
                    style={tableRow}
                     onMouseEnter={(e) =>
                     e.currentTarget.style.background =  "#f8fafc"
  }

                     onMouseLeave={(e) =>
                      e.currentTarget.style.background =  "white"
  }

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

                              "#ef4444"

                              :

                              row.severity ===
                              "MEDIUM"

                              ?

                              "#f59e0b"

                              :

                              "#eab308",
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

                              "#3b82f6"

                              :

                              row.status ===
                              "IN_PROGRESS"

                              ?

                              "#7c3aed"

                              :

                              "#22c55e",
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

                        row.anomalies
                          .length > 0 ? (

                          <details>

                            <summary
                              style={
                                insightBtn
                              }
                            >

                              🤖 AI Insights

                            </summary>

                            <div
                              style={{
                                marginTop:
                                  "10px",
                              }}
                            >

                              {

                                row.anomalies.map(
                                  (
                                    alert,
                                    index
                                  ) => (

                                    <div
                                      key={
                                        index
                                      }

                                      style={
                                        anomalyStyle
                                      }
                                    >

                                      ⚠️{" "}
                                      {alert}

                                    </div>

                                  )
                                )

                              }

                            </div>

                          </details>

                        ) : (

                          <span
                            style={{
                              color:
                                "#64748b",
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

              {

                filteredComplaints.length ===
                  0 && (

                  <tr>
                   
                    <td
                      colSpan="8"

                      style={{
                        padding:
                          "30px",

                        textAlign:
                          "center",

                        color:
                          "#64748b",

                        fontWeight:
                          "600",
                      }}
                    >

                      ✅ No complaints
                      found for selected
                      filters

                    </td>

                  </tr>

                )

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;

// ================= STYLES =================

const pageStyle = {
  padding: "25px",
  background:
    "linear-gradient(to right, #eef2f3, #ffffff)",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  marginBottom: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background:
    "linear-gradient(to right, #dbeafe, #ffffff)",
  padding: "25px",
  borderRadius: "18px",
};

const titleStyle = {
  fontSize: "34px",
  fontWeight: "bold",
  color: "#111827",
};

const subtitleStyle = {
  marginTop: "5px",
  fontSize: "16px",
  color: "#64748b",
};

const dateStyle = {
  marginTop: "8px",
  color: "#475569",
  fontWeight: "600",
};

const logoutBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s ease",
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
  padding: "22px",
  borderRadius: "18px",
  boxShadow:
    "0px 4px 16px rgba(0,0,0,0.12)",
  transition: "0.2s ease",
  cursor: "pointer",
};

const cardTitle = {
  fontSize: "16px",
  color: "#64748b",
  marginBottom: "10px",
};

const cardValue = {
  fontSize: "34px",
  fontWeight: "bold",
  color: "#111827",
};

const sectionCard = {
  background: "white",
  padding: "24px",
  borderRadius: "18px",
  boxShadow:
    "0px 4px 16px rgba(0,0,0,0.12)",
  marginBottom: "30px",
};

const sectionTitle = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "18px",
  color: "#111827",
};

const authorityGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
};

const authorityCard = {
  padding: "20px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const smallTitle = {
  fontSize: "15px",
  color: "#64748b",
};

const bigValue = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  marginTop: "8px",
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
  padding: "24px",
  borderRadius: "18px",
  minHeight: "380px",
  boxShadow:
    "0px 4px 16px rgba(0,0,0,0.12)",
};

const filterBar = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const filterSelect = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

const tableHeader = {
  background: "#3b82f6",
  color: "white",
};

const thStyle = {
  padding: "14px",
  textAlign: "left",
  position: "sticky",
top: 0,
zIndex: 10,
};

const tableRow = {
  background: "white",
  boxShadow:
    "0px 2px 8px rgba(0,0,0,0.05)",
};

const tdStyle = {
  padding: "14px",
};

const tagStyle = {
  padding: "7px 14px",
  borderRadius: "14px",
  color: "white",
  fontSize: "13px",
  fontWeight: "bold",
  boxShadow:
    "0px 2px 6px rgba(0,0,0,0.15)",
};

const insightBtn = {
  background:
    "linear-gradient(to right, #2563eb, #1d4ed8)",
  color: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  width: "fit-content",
};

const anomalyStyle = {
  background: "#fff7ed",
  color: "#c2410c",
  border: "1px solid #fdba74",
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "12px",
  fontWeight: "600",
  marginBottom: "8px",
};