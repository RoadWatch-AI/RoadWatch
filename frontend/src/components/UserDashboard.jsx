import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

function UserDashboard() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [complaints, setComplaints] =
    useState([]);
  const safeComplaints =
  Array.isArray(complaints)
    ? complaints
    : [];

  // =========================================================
  // FETCH REAL USER COMPLAINTS
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    fetch(

      "http://127.0.0.1:5000/my-complaints",

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    )

      .then((res) => res.json())

      .then((data) => {

        setComplaints(data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.clear();

    window.location.reload();

  };

  // =========================================================
  // STATS
  // =========================================================

  const totalComplaints =
    safeComplaints.length;

  const activeComplaints =
    safeComplaints.filter(
      (c) => c.status === "ACTIVE"
    ).length;

  const progressComplaints =
    safeComplaints.filter(
      (c) => c.status === "IN_PROGRESS"
    ).length;

  const resolvedComplaints =
    safeComplaints.filter(
      (c) => c.status === "RESOLVED"
    ).length;

  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="dashboard"
      style={{
        overflowY: "auto",
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >

      {/* NAVBAR */}

      <div className="navbar">

        <h1>RoadWatch</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* HERO */}

      <div className="hero">

        <h2>
          Welcome back 👋
        </h2>

        <p>
          Monitor and report road infrastructure issues in real time.
        </p>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="card">

          <h3>{totalComplaints}</h3>

          <p>Complaints Submitted</p>

        </div>

        <div className="card active">

          <h3>{activeComplaints}</h3>

          <p>Active Complaints</p>

        </div>

        <div className="card progress">

          <h3>{progressComplaints}</h3>

          <p>In Progress</p>

        </div>

        <div className="card resolved">

          <h3>{resolvedComplaints}</h3>

          <p>Resolved Complaints</p>

        </div>

      </div>

      {/* ACTION BUTTONS */}

      <div className="actions">

        <button
          className="action-btn"
          onClick={() => navigate("/map")}
        >
          Report New Issue
        </button>

        <button
          className="action-btn secondary"
          onClick={() => navigate("/complaints")}
        >
          My Complaints
        </button>

      </div>

      {/* RECENT COMPLAINTS */}

      <div className="table-section">

        <h2>My Recent Complaints</h2>

        <div
          style={{
            overflowX: "auto",
          }}
        >

          <table>

            <thead>

              <tr>

                <th>Issue</th>

                <th>Road</th>

                <th>Severity</th>

                <th>Status</th>

                <th>AI Alerts</th>

              </tr>

            </thead>

            <tbody>

              {safeComplaints.length > 0 ? (

                safeComplaints.map((c, index) => (

                  <tr key={index}>

                    <td>{c.issue}</td>

                    <td>{c.road_name}</td>

                    <td>

                      <span
                        className={`severity ${c.severity?.toLowerCase()}`}
                      >
                        {c.severity}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`status ${
                          c.status === "ACTIVE"
                            ? "active-status"
                            : c.status === "IN_PROGRESS"
                            ? "progress-status"
                            : "resolved-status"
                        }`}
                      >
                        {c.status}
                      </span>

                    </td>

                   <td>

  {
    c.anomalies &&
    c.anomalies.length > 0 ? (

      <details
        className="insight-dropdown"
      >

        <summary
          className="insight-btn"
        >

          View Insights

        </summary>

        <div
          className="insight-box"
        >

          {

            c.anomalies.map(
              (alert, index) => (

                <div
                  key={index}
                  className="anomaly-alert"
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

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No complaints yet 🚀
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default UserDashboard;