import { useState } from "react";

import { useNavigate } from "react-router-dom";

function MyComplaints() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("");

  const complaints = [

    {
      issue: "Pothole",
      road: "OMR Road",
      severity: "HIGH",
      status: "ACTIVE",
      lat: 12.9915,
      lon: 80.2337,
    },

    {
      issue: "Road Crack",
      road: "Sardar Patel Road",
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      lat: 13.0109,
      lon: 80.2353,
    },

    {
      issue: "Pothole",
      road: "ECR Road",
      severity: "LOW",
      status: "RESOLVED",
      lat: 12.9270,
      lon: 80.2500,
    },

  ];

  const filteredComplaints =
    complaints.filter((c) => {

      const matchesSearch =

        c.issue.toLowerCase().includes(
          search.toLowerCase()
        ) ||

        c.road.toLowerCase().includes(
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

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.map(
              (c, index) => (

                <tr key={index}>

                  <td>{c.issue}</td>

                  <td>{c.road}</td>

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

        <button>
          Previous
        </button>

        <button>
          Next
        </button>

      </div>

    </div>
  );
}

export default MyComplaints;