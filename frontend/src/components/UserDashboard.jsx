import { useNavigate } from "react-router-dom";

function UserDashboard() {

  const navigate = useNavigate();

  return (

    <div className="dashboard">

      {/* NAVBAR */}

      <div className="navbar">

        <h1>RoadWatch</h1>

        <button className="logout-btn">
          Logout
        </button>

      </div>

      {/* HERO SECTION */}

      <div className="hero">

        <h2>
          Welcome back 👋
        </h2>

        <p>
          Monitor and report road
          infrastructure issues in real time.
        </p>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="card">
          <h3>12</h3>
          <p>Complaints Submitted</p>
        </div>

        <div className="card active">
          <h3>5</h3>
          <p>Active Complaints</p>
        </div>

        <div className="card progress">
          <h3>3</h3>
          <p>In Progress</p>
        </div>

        <div className="card resolved">
          <h3>4</h3>
          <p>Resolved</p>
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
          onClick={() => navigate("/map")}
        >
          Open Monitoring Map
        </button>

      </div>

      {/* RECENT COMPLAINTS */}

      <div className="table-section">

        <h2>Recent Complaints</h2>

        <table>

          <thead>

            <tr>
              <th>Issue</th>
              <th>Road</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            <tr>

              <td>Pothole</td>

              <td>OMR Road</td>

              <td>
                <span className="severity high">
                  HIGH
                </span>
              </td>

              <td>
                <span className="status active-status">
                  ACTIVE
                </span>
              </td>

            </tr>

            <tr>

              <td>Road Crack</td>

              <td>Sardar Patel Road</td>

              <td>
                <span className="severity medium">
                  MEDIUM
                </span>
              </td>

              <td>
                <span className="status progress-status">
                  IN_PROGRESS
                </span>
              </td>

            </tr>

            <tr>

              <td>Pothole</td>

              <td>ECR Road</td>

              <td>
                <span className="severity low">
                  LOW
                </span>
              </td>

              <td>
                <span className="status resolved-status">
                  RESOLVED
                </span>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UserDashboard;