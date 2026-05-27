import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function MyComplaints() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("");

  const [complaints, setComplaints] =
  useState([]);

  const [currentPage, setCurrentPage] =
  useState(1);

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

    .then((res) => {

      // ===============================
      // SESSION EXPIRED
      // ===============================

      if (res.status === 401) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.clear();

        window.location.href = "/";

        return null;

      }

      return res.json();

    })

    .then((data) => {

      if (data) {

        setComplaints(data);

      }

    })

    .catch((err) => {

      console.log(err);

    });

}, []);

  const filteredComplaints =
    complaints.filter((c) => {

      const matchesSearch =

        c.issue.toLowerCase().includes(
          search.toLowerCase()
        ) ||

        c.road_name.toLowerCase().includes(
          search.toLowerCase()
        ) ||

        c.status.toLowerCase().includes(
          search.toLowerCase()
        );

      const matchesStatus =

        statusFilter === "" ||
        c.status === statusFilter;

      const matchesSeverity =

        severityFilter === "" ||
        c.severity === severityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity
      );

    });

  const complaintsPerPage = 5;

const indexOfLastComplaint =

  currentPage *
  complaintsPerPage;

const indexOfFirstComplaint =

  indexOfLastComplaint -
  complaintsPerPage;

const currentComplaints =

  filteredComplaints.slice(

    indexOfFirstComplaint,

    indexOfLastComplaint

  );

const totalPages = Math.ceil(

  filteredComplaints.length /

  complaintsPerPage

);  

  return (

    <div className="dashboard">

      <h1>All Complaints History</h1>

      {/* SEARCH */}

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* FILTERS */}

      <div className="filter-wrapper">

        {/* STATUS FILTER */}

        <div className="filter-box">

          <label>
            Filter by Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="">
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

        {/* SEVERITY FILTER */}

        <div className="filter-box">

          <label>
            Filter by Severity
          </label>

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
          >

            <option value="">
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

        </div>

      </div>
      

      {/* TABLE */}

      <div className="table-section">

        <table>

          <thead>

            <tr>

              <th>Issue</th>

              <th>Road</th>

              <th>Severity</th>

              <th>Status</th>

              <th>AI Alerts</th>

              <th>Actions</th>

              

            </tr>

          </thead>

          <tbody>

           {currentComplaints.map(
              (c, index) => (

                <tr key={index}>

                  <td>{c.issue}</td>

                  <td>{c.road_name}</td>

                  <td>

                    <span
                      className={`severity ${c.severity.toLowerCase()}`}
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

                  <td>

                    <button
                      className="map-btn"
                      onClick={() =>
                        navigate(
                          `/map?lat=${c.lat}&lon=${c.lon}`
                        )
                      }
                    >
                      Show on Map
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="pagination">

        <button

  disabled={currentPage === 1}

  onClick={() => {

    if (currentPage > 1) {

      setCurrentPage(
        currentPage - 1
      );

    }

  }}
>

  Previous

</button>

        <button

  disabled={
    currentPage === totalPages
  }

  onClick={() => {

    if (
      currentPage < totalPages
    ) {

      setCurrentPage(
        currentPage + 1
      );

    }

  }}
>

  Next

</button>

      </div>

    </div>
  );
}

export default MyComplaints;