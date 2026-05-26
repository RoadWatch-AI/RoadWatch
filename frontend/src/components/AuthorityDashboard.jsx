import React, { useEffect, useState } from "react";

const AuthorityDashboard = () => {

  const [complaints, setComplaints] =
    useState([]);

  const [openDropdown, setOpenDropdown] =
  useState(null);

const [openRepairForm, setOpenRepairForm] =
  useState(null);

const [repairData, setRepairData] =
  useState({

    contractor: "",

    repairType: "",

    repairDate: "",

    repairCost: "",

    remarks: "",

  });

  const [repairAdded, setRepairAdded] =
  useState({});

const [openMaintenanceForm, setOpenMaintenanceForm] =
  useState(null);

const [maintenanceData, setMaintenanceData] =
  useState({

    maintenanceType: "",

    scheduledDate: "",

    status: "PLANNED",

    remarks: "",

  });

const [maintenanceHistory, setMaintenanceHistory] =
  useState({});

  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.clear();

    window.location.reload();

  };

  // ================= FILTER STATES =================

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [issueFilter, setIssueFilter] =
    useState("ALL");

  const [dateFilter, setDateFilter] =
    useState("ALL");

  // ================= FETCH COMPLAINTS =================

  useEffect(() => {

 const token =
  localStorage.getItem("token");

fetch(
  "http://127.0.0.1:5000/authority/complaints",
  {

    headers: {

      Authorization:
        `Bearer ${token}`

    }

  }
)

      .then((res) => {

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

        console.error(
          "Error fetching complaints:",
          err
        );

      });

  }, []);

  // ================= DATE FILTER =================

  const isWithinDateRange =
    (complaintDate) => {

      if (dateFilter === "ALL")
        return true;

      const today = new Date();

      const cDate =
        new Date(complaintDate);

      if (dateFilter === "TODAY") {

        return (

          cDate.getDate() ===
            today.getDate() &&

          cDate.getMonth() ===
            today.getMonth() &&

          cDate.getFullYear() ===
            today.getFullYear()

        );

      }

      if (dateFilter === "WEEK") {

        const weekAgo =
          new Date();

        weekAgo.setDate(
          today.getDate() - 7
        );

        return cDate >= weekAgo;

      }

      if (dateFilter === "MONTH") {

        const monthAgo =
          new Date();

        monthAgo.setMonth(
          today.getMonth() - 1
        );

        return cDate >= monthAgo;

      }

      return true;

    };

  // ================= FILTERED DATA =================

  const filteredComplaints =
    complaints

      .filter((c) => {

        return (

          c.road_name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          c.issue
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

        );

      })

      .filter((c) =>

        severityFilter === "ALL"

          ?

          true

          :

          c.severity ===
            severityFilter

      )

      .filter((c) =>

        statusFilter === "ALL"

          ?

          true

          :

          c.status ===
            statusFilter

      )

      .filter((c) =>

        issueFilter === "ALL"

          ?

          true

          :

          c.issue ===
            issueFilter

      )

      .filter((c) =>

        isWithinDateRange(
          c.created_at
        )

      );

// ================= FETCH MAINTENANCE =================

const fetchMaintenance = async (
  complaintId
) => {

  try {

    const token =
    localStorage.getItem("token");

const response =
  await fetch(

    `http://127.0.0.1:5000/maintenance/${complaintId}`,

    {

      headers: {

        Authorization:
          `Bearer ${token}`

      }

    }

  );

    const data =
      await response.json();

    setMaintenanceHistory((prev) => ({

      ...prev,

      [complaintId]: data,

    }));

  } catch (err) {

    console.log(err);

  }

};

  // ================= UI =================

  return (

    <div style={pageStyle}>

      {/* HEADER */}

      <div
        style={headerStyle}
      >

        <div>

          <h1 style={titleStyle}>
            🏢 Authority Dashboard
          </h1>

          <p style={subTitleStyle}>
            Complaints related to your authority zone
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={logoutBtn}
        >
          Logout
        </button>

      </div>

      {/* FILTERS */}

      <div style={filterBar}>

        {/* SEARCH */}

        <input
          style={searchBox}
          type="text"
          placeholder="Search road name"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* SEVERITY */}

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

        {/* STATUS */}

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

        {/* ISSUE */}

        <select
          style={filterSelect}
          value={issueFilter}
          onChange={(e) =>
            setIssueFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            All Issues
          </option>

          <option value="Pothole">
            Pothole
          </option>

          <option value="Crack">
            Crack
          </option>

          <option value="Waterlogging">
            Waterlogging
          </option>

          <option value="Road Damage">
            Road Damage
          </option>

        </select>

        {/* DATE */}

        <select
          style={filterSelect}
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(
              e.target.value
            )
          }
        >

          <option value="ALL">
            All Dates
          </option>

          <option value="TODAY">
            Today
          </option>

          <option value="WEEK">
            This Week
          </option>

          <option value="MONTH">
            This Month
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div style={tableBox}>

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
                Issue
              </th>

              <th style={thStyle}>
                Severity
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Date
              </th>

              <th style={thStyle}>
                  AI Insights
              </th>

              <th style={thStyle}>
                  Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.length >
            0

              ?

              filteredComplaints.map(
                (c) => (

                  <tr
                    key={c.id}
                    style={tableRow}
                  >

                    <td style={tdStyle}>
                      {c.id}
                    </td>

                    <td style={tdStyle}>
                      {c.road_name}
                    </td>

                    <td style={tdStyle}>
                      {c.issue}
                    </td>

                    {/* SEVERITY */}

                    <td style={tdStyle}>

                      <span
                        style={{
                          ...badgeStyle,

                          background:

                            c.severity ===
                            "HIGH"

                              ?

                              "#f44336"

                              :

                              c.severity ===
                              "MEDIUM"

                              ?

                              "#ff9800"

                              :

                              "#4caf50",
                        }}
                      >

                        {c.severity}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td style={tdStyle}>

                      <span
                        style={{
                          ...badgeStyle,

                          background:

                            c.status ===
                            "ACTIVE"

                              ?

                              "#2196f3"

                              :

                              c.status ===
                              "IN_PROGRESS"

                              ?

                              "#9c27b0"

                              :

                              "#4caf50",
                        }}
                      >

                        {c.status}

                      </span>

                    </td>

                    <td style={tdStyle}>

                      {new Date(
                        c.created_at
                      ).toLocaleDateString()}

                    </td>

                    <td style={tdStyle}>

  {
    c.anomalies?.length > 0 ? (

      <details>

        <summary
          style={insightBtn}
        >

          View Insights

        </summary>

        <div
          style={{
            marginTop: "10px",
          }}
        >

          {

            c.anomalies.map(
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

<td style={tdStyle}>

  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      position: "relative",
    }}
  >

    {/* UPDATE SECTION */}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >

      <button

        style={{
          ...actionBtn,
          background: "#2563eb",
        }}

        onClick={() => {

          if (openDropdown === c.id) {

            setOpenDropdown(null);

          } else {

            setOpenDropdown(c.id);

          }

        }}
      >

        Update Status

      </button>

      {

        openDropdown === c.id && (

          <select

            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "130px",
              marginTop: "6px",
              border: "1px solid #cbd5e1",
              fontWeight: "600",
            }}

            defaultValue={c.status}

            onChange={async (e) => {

              const token =
                localStorage.getItem("token");

              const newStatus =
                e.target.value;

              try {

                const response = await fetch(

                  `http://127.0.0.1:5000/update-status/${c.id}`,

                  {

                    method: "PUT",

                    headers: {

                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${token}`

                    },

                    body: JSON.stringify({

                      status: newStatus

                    })

                  }

                );

                const data =
                  await response.json();

                alert(data.message);

                window.location.reload();

              } catch (err) {

                console.log(err);

              }

            }}
          >

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

        )

      }

    </div>

{/* ADD REPAIR */}

<div>

{

  c.status === "RESOLVED" ||

repairAdded[c.id] ? (

    <button

      disabled

      style={{
        ...actionBtn,
        background: "#16a34a",
        cursor: "default",
      }}

    >

      Repair Added ✅

    </button>

  ) : (

    <button

      style={actionBtn}

      onClick={() => {

        if (openRepairForm === c.id) {

          setOpenRepairForm(null);

        } else {

          setOpenRepairForm(c.id);

        }

      }}
    >

      Add Repair

    </button>

  )

}  

 {

  openRepairForm === c.id &&

  !repairAdded[c.id] && (

      <div
        style={{
          marginTop: "12px",
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          width: "280px",
        }}
      >

        <input
          type="text"
          placeholder="Contractor"
          style={repairInput}
          value={repairData.contractor}
          onChange={(e) =>
            setRepairData({

              ...repairData,

              contractor:
                e.target.value,

            })
          }
        />

        <select

  style={repairInput}

  value={repairData.repairType}

  onChange={(e) =>
    setRepairData({

      ...repairData,

      repairType:
        e.target.value,

    })
  }

>

  <option value="">
    Select Repair Type
  </option>

  <option value="Pothole Filling">
    Pothole Filling
  </option>

  <option value="Road Resurfacing">
    Road Resurfacing
  </option>

  <option value="Crack Sealing">
    Crack Sealing
  </option>

  <option value="Temporary Patch">
    Temporary Patch
  </option>

  <option value="Full Reconstruction">
    Full Reconstruction
  </option>

</select>

        <input
          type="date"
          style={repairInput}
          value={repairData.repairDate}
          onChange={(e) =>
            setRepairData({

              ...repairData,

              repairDate:
                e.target.value,

            })
          }
        />

        <input
          type="number"
          placeholder="Repair Cost"
          style={repairInput}
          value={repairData.repairCost}
          onChange={(e) =>
            setRepairData({

              ...repairData,

              repairCost:
                e.target.value,

            })
          }
        />

        <textarea
          placeholder="Remarks"
          style={{
            ...repairInput,
            height: "70px",
          }}
          value={repairData.remarks}
          onChange={(e) =>
            setRepairData({

              ...repairData,

              remarks:
                e.target.value,

            })
          }
        />

        <button

          style={{
            ...actionBtn,
            width: "100%",
            marginTop: "10px",
          }}

          onClick={async () => {

            try {

              const token =
                 localStorage.getItem("token");

              const response =
                await fetch(

                  "http://127.0.0.1:5000/add-repair",

                  {

                    method: "POST",

                    headers: {

  "Content-Type":
    "application/json",

  Authorization:
    `Bearer ${token}`

},

                    body: JSON.stringify({

                      complaint_id: c.id,

                      repaired_by:
                        repairData.contractor,

                      repair_type:
                        repairData.repairType,

                      repair_date:
                        repairData.repairDate,

                      repair_cost:
                        repairData.repairCost,

                      remarks:
                        repairData.remarks

                    })

                  }

                );

              const data =
                await response.json();

              alert(data.message);

setRepairAdded((prev) => ({

  ...prev,

  [c.id]: true,

}));

setOpenRepairForm(null);
            } catch (err) {

              console.log(err);

            }

          }}
        >

          Submit Repair

        </button>

      </div>

    )

  }

</div>

{
  c.anomalies?.length > 0 &&

  c.status !== "RESOLVED" && (

<div>

{/* MAINTENANCE */}

  <button

    style={{
      ...actionBtn,
      background: "#7c3aed",
    }}

    onClick={() => {

      if (
        openMaintenanceForm === c.id
      ) {

        setOpenMaintenanceForm(null);

      } else {

        setOpenMaintenanceForm(c.id);

        fetchMaintenance(c.id);

      }

    }}
  >

    Maintenance

  </button>

  {

    openMaintenanceForm === c.id && (

      <div
        style={{
          marginTop: "12px",
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          width: "320px",
        }}
      >

        <select

          style={repairInput}

          value={
            maintenanceData.maintenanceType
          }

          onChange={(e) =>
            setMaintenanceData({

              ...maintenanceData,

              maintenanceType:
                e.target.value,

            })
          }
        >

          <option value="">
            Select Maintenance
          </option>

          <option value="Inspection">
            Inspection
          </option>

          <option value="Pothole Repair">
            Pothole Repair
          </option>

          <option value="Crack Sealing">
            Crack Sealing
          </option>

          <option value="Road Relaying">
            Road Relaying
          </option>

        </select>

        <input
          type="date"
          style={repairInput}
          value={
            maintenanceData.scheduledDate
          }
          onChange={(e) =>
            setMaintenanceData({

              ...maintenanceData,

              scheduledDate:
                e.target.value,

            })
          }
        />

        <select

          style={repairInput}

          value={
            maintenanceData.status
          }

          onChange={(e) =>
            setMaintenanceData({

              ...maintenanceData,

              status:
                e.target.value,

            })
          }
        >

          <option value="PLANNED">
            PLANNED
          </option>

          <option value="PENDING">
            PENDING
          </option>

          <option value="COMPLETED">
            COMPLETED
          </option>

        </select>

        <textarea

          placeholder="Remarks"

          style={{
            ...repairInput,
            height: "70px",
          }}

          value={
            maintenanceData.remarks
          }

          onChange={(e) =>
            setMaintenanceData({

              ...maintenanceData,

              remarks:
                e.target.value,

            })
          }
        />

        <button

          style={{
            ...actionBtn,
            width: "100%",
            marginTop: "10px",
            background: "#7c3aed",
          }}

          onClick={async () => {

            try {

              const token =
               localStorage.getItem("token");

              const response =
                await fetch(

                  "http://127.0.0.1:5000/add-maintenance",

                  {

                    method: "POST",

                    headers: {

  "Content-Type":
    "application/json",

  Authorization:
    `Bearer ${token}`

},
                    body: JSON.stringify({

                      complaint_id: c.id,

                      road_name:
                        c.road_name,

                      maintenance_type:
                        maintenanceData.maintenanceType,

                      scheduled_date:
                        maintenanceData.scheduledDate,

                      status:
                        maintenanceData.status,

                      remarks:
                        maintenanceData.remarks

                    })

                  }

                );

              const data =
                await response.json();

              alert(data.message);

              fetchMaintenance(c.id);

            } catch (err) {

              console.log(err);

            }

          }}
        >

          Schedule Maintenance

        </button>

        {/* HISTORY */}

        {

          maintenanceHistory[c.id]
            ?.length > 0 && (

            <div
              style={{
                marginTop: "15px",
              }}
            >

              <h4>
                Maintenance History
              </h4>

              {

                maintenanceHistory[
                  c.id
                ].map((m) => (

                  <div
                    key={m.id}
                    style={maintenanceCard}
                  >

                    <p>
                      <b>Type:</b>
                      {" "}
                      {m.maintenance_type}
                    </p>

                    <p>
                      <b>Date:</b>
                      {" "}
                      {

                        new Date(
                          m.scheduled_date
                        ).toLocaleDateString()

                      }
                    </p>

                    <p>
                      <b>Status:</b>
                      {" "}
                      {m.status}
                    </p>

                    <p>
                      <b>Remarks:</b>
                      {" "}
                      {m.remarks}
                    </p>

                  </div>

                ))

              }

            </div>

          )

        }

      </div>

    )

  }

</div>

)

}

  </div>

</td>

                  </tr>

                )
              )

              :

              (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      ...tdStyle,
                      textAlign:
                        "center",
                    }}
                  >

                    ❌ No complaints found

                  </td>

                </tr>

              )}

          </tbody>

        </table>

      </div>

      {/* COUNT */}

      <p
        style={{
          marginTop: "15px",
          color: "#444",
        }}
      >

        Showing

        {" "}

        <b>
          {
            filteredComplaints.length
          }
        </b>

        {" "}

        complaints

      </p>

    </div>

  );

};

export default AuthorityDashboard;

// ================= STYLES =================

const pageStyle = {
  padding: "25px",
  background: "#f2f4f7",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#222",
};

const subTitleStyle = {
  fontSize: "15px",
  color: "#666",
  marginTop: "5px",
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

const filterBar = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const searchBox = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  width: "250px",
};

const filterSelect = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const tableBox = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow:
    "0px 4px 10px rgba(0,0,0,0.12)",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeader = {
  background: "#2196f3",
  color: "white",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tableRow = {
  borderBottom:
    "1px solid #ddd",
};

const tdStyle = {
  padding: "12px",
  color: "#333",
};

const badgeStyle = {
  padding: "6px 12px",
  borderRadius: "12px",
  color: "white",
  fontWeight: "bold",
  fontSize: "14px",
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

const actionBtn = {

  width: "130px",

  padding: "8px 12px",

  border: "none",

  borderRadius: "8px",

  background: "#1d4ed8",

  color: "white",

  fontWeight: "600",

  cursor: "pointer",

  fontSize: "13px",

  marginRight: "8px",

};

const repairInput = {

  width: "100%",

  padding: "10px",

  marginBottom: "10px",

  borderRadius: "8px",

  border: "1px solid #cbd5e1",

  fontSize: "14px",

};

const maintenanceCard = {

  background: "white",

  border: "1px solid #e2e8f0",

  borderRadius: "10px",

  padding: "10px",

  marginTop: "10px",

  fontSize: "13px",

};