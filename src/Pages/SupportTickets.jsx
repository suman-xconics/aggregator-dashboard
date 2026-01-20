import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, X } from "lucide-react";
import {
  getSupportTickets,
  updateSupportTicket,
} from "../api/supportTicketApi";
import { getAggregators } from "../api/aggregatorApi";
import "./Dashboard.css";

/** ---------------------------
 *  Date helpers
 *  --------------------------*/

const formatDate = (isoDateString) => {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

const formatDateTime = (isoDateString) => {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "N/A";
  }
};

/** ---------------------------
 *  Badge helpers
 *  --------------------------*/

const getStatusBadgeStyle = (status) => {
  const styles = {
    NEW: { backgroundColor: "#e3f2fd", color: "#1976d2" },
    PENDING: { backgroundColor: "#e3f2fd", color: "#1976d2" },
    ASSIGNED: { backgroundColor: "#000000", color: "#f57c00" },
    ACCEPTED: { backgroundColor: "#e0f2f1", color: "#00796b" },
    IN_PROGRESS: { backgroundColor: "#fce4ec", color: "#c2185b" },
    COMPLETED: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    CANCELLED: { backgroundColor: "#ffebee", color: "#c62828" },
  };
  return styles[status] || { backgroundColor: "#f5f5f5", color: "#666" };
};

const getAadhaarStatusBadge = (status) => {
  const styles = {
    VERIFIED: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    NOT_VERIFIED: { backgroundColor: "#fff3e0", color: "#f57c00" },
  };
  return styles[status] || { backgroundColor: "#f5f5f5", color: "#666" };
};

const getChecklistBadge = (status) => {
  const styles = {
    PASS: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    FAIL: { backgroundColor: "#ffebee", color: "#c62828" },
  };
  return styles[status] || { backgroundColor: "#f5f5f5", color: "#666" };
};

export default function SupportTicketsDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { limit: 1000 };
      const result = await getSupportTickets(params);

      if (result.success) {
        setTickets(result.data);
      } else {
        setError(result.error);
        setTickets([]);
      }
    } catch (err) {
      setError("Failed to fetch tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    if (filter !== "ALL") {
      filtered = filtered.filter((t) => t.status === filter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.ticketNo?.toLowerCase().includes(q) ||
          t.issueDetail?.toLowerCase().includes(q) ||
          t.supportAddress?.toLowerCase().includes(q) ||
          t.installationRequisition?.vehicleNo?.toLowerCase().includes(q) ||
          t.installationRequisition?.customerName?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [tickets, filter, searchTerm]);

  const counts = useMemo(() => {
    return {
      total: tickets.length,
      new: tickets.filter((t) => t.status === "NEW").length,
      assigned: tickets.filter((t) => t.status === "ASSIGNED").length,
      inProgress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      completed: tickets.filter((t) => t.status === "COMPLETED").length,
      cancelled: tickets.filter((t) => t.status === "CANCELLED").length,
    };
  }, [tickets]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedTicket(null);
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [ticketId]: true }));
    
    try {
      const result = await updateSupportTicket(ticketId, { status: newStatus });
      if (result.success) {
        fetchTickets(); // Refresh all tickets
      } else {
        alert(`Error updating status: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>Support Tickets</h2>
          <p className="breadcrumb">Home • Dashboard • Support Tickets</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <SummaryCard title="Total" value={counts.total} color="blue" onClick={() => setFilter("ALL")} active={filter === "ALL"} />
        <SummaryCard title="New" value={counts.new} color="blue" onClick={() => setFilter("NEW")} active={filter === "NEW"} />
        <SummaryCard title="Assigned" value={counts.assigned} color="orange" onClick={() => setFilter("ASSIGNED")} active={filter === "ASSIGNED"} />
        <SummaryCard title="In Progress" value={counts.inProgress} color="pink" onClick={() => setFilter("IN_PROGRESS")} active={filter === "IN_PROGRESS"} />
        <SummaryCard title="Completed" value={counts.completed} color="green" onClick={() => setFilter("COMPLETED")} active={filter === "COMPLETED"} />
        <SummaryCard title="Cancelled" value={counts.cancelled} color="red" onClick={() => setFilter("CANCELLED")} active={filter === "CANCELLED"} />
      </div>

      {/* FILTER & SEARCH */}
      <div style={{ padding: "0 1.5rem", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "0.95rem",
            }}
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div style={{ flex: 2 }}>
          <input
            type="text"
            placeholder="Search by ticket no, issue detail, address, vehicle no, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "0.95rem",
            }}
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            margin: "0 1.5rem 1rem 1.5rem",
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {/* TICKET TABLE */}
      <div className="ticket-card">
        <table>
          <thead>
            <tr>
              <th>Ticket No</th>
              <th>Issue Detail</th>
              <th>Address</th>
              <th>Vehicle No</th>
              <th>Customer</th>
              <th>State/District</th>
              <th>Requested</th>
              <th>Preferred Date</th>
              <th>Aadhaar</th>
              <th>Status</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  {[...Array(12)].map((_, colIndex) => (
                    <td key={colIndex}>
                      <div className="skeleton-line" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: "2rem" }}>
                  No support tickets found
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td><strong>{ticket.ticketNo}</strong></td>
                  <td style={{ maxWidth: "200px" }} title={ticket.issueDetail}>
                    {ticket.issueDetail}
                  </td>
                  <td style={{ maxWidth: "150px" }} title={ticket.supportAddress}>
                    {ticket.supportAddress}
                  </td>
                  <td>{ticket.installationRequisition?.vehicleNo || "N/A"}</td>
                  <td>{ticket.installationRequisition?.customerName || "N/A"}</td>
                  <td>
                    {ticket.state}/{ticket.district}
                  </td>
                  <td style={{ fontSize: "0.9rem" }}>{formatDate(ticket.requestedAt)}</td>
                  <td style={{ fontSize: "0.9rem" }}>{formatDate(ticket.preferredSupportDate)}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getAadhaarStatusBadge(ticket.aadhaarVerificationStatus),
                      }}
                    >
                      {ticket.aadhaarVerificationStatus?.substring(0, 3) || "N/A"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                      disabled={updatingStatus[ticket.id]}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: updatingStatus[ticket.id] ? "#f5f5f5" : "white",
                        fontSize: "0.8rem",
                        minWidth: "110px",
                        cursor: updatingStatus[ticket.id] ? "not-allowed" : "pointer",
                      }}
                    >
                      <option value="NEW">NEW</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        backgroundColor: ticket.completedAt != null ? "#e8f5e9" : "#ffebee",
                        color: ticket.completedAt != null ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {ticket.completedAt ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleViewDetails(ticket)} 
                        title="View Details"
                        style={{ color: "#1976d2" }}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && selectedTicket && (
        <TicketViewModal
          ticket={selectedTicket}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, value, color, onClick, active }) {
  return (
    <div
      className={`summary-card ${color} ${active ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer", border: active ? "2px solid #1976d2" : "1px solid #e0e0e0" }}
    >
      <h4>{title}</h4>
      <p>{value} Tickets</p>
    </div>
  );
}

// Read-Only Ticket View Modal
function TicketViewModal({ ticket, onClose }) {
  const [aggregators, setAggregators] = useState([]);
  const [aggregatorMap, setAggregatorMap] = useState({});

  useEffect(() => {
    const fetchAggregators = async () => {
      try {
        const result = await getAggregators({ limit: 1000 });
        if (result.success) {
          const map = {};
          result.data.forEach(agg => {
            map[agg.id] = agg;
          });
          setAggregators(result.data);
          setAggregatorMap(map);
        }
      } catch (error) {
        console.error("Failed to fetch aggregators:", error);
      }
    };
    fetchAggregators();
  }, []);

  const assignedAggregator = ticket.assignedAggregatorId ? aggregatorMap[ticket.assignedAggregatorId]?.aggregatorName || "N/A" : "Not Assigned";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "900px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ margin: 0, color: "#000" }}>Ticket Details</h2>
            <p style={{ margin: "0.5rem 0 0 0", color: "#666", fontSize: "1rem" }}>
              <strong>{ticket.ticketNo}</strong>
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} style={{ color: "#000" }} />
          </button>
        </div>

        <div className="modal-body" style={{ paddingBottom: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
            
            {/* Basic Info */}
            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>Basic Information</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div><strong>Ticket No:</strong> {ticket.ticketNo}</div>
                <div><strong>Issue:</strong> {ticket.issueDetail}</div>
                <div><strong>Installation Req ID:</strong> {ticket.installationRequisitionId || "N/A"}</div>
                <div><strong>Requested By:</strong> {ticket.requestedBy || "N/A"}</div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>Support Address</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ lineHeight: "1.5" }}>
                  <strong>Address:</strong><br/>
                  {ticket.supportAddress}
                </div>
                <div style={{ display: "flex", gap: "2rem", fontSize: "0.95rem" }}>
                  <div><strong>State:</strong> {ticket.state}</div>
                  <div><strong>District:</strong> {ticket.district}</div>
                  <div><strong>Pincode:</strong> {ticket.pincode}</div>
                </div>
              </div>
            </div>

            {/* Dates & Assignment */}
            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>Timeline & Assignment</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><strong>Requested At:</strong> {formatDateTime(ticket.requestedAt)}</div>
                  <div><strong>Preferred Date:</strong> {formatDate(ticket.preferredSupportDate)}</div>
                </div>
                <div><strong>TAT Hours:</strong> {ticket.tatHours || "N/A"}</div>
                <div><strong>Target Finish:</strong> {formatDate(ticket.supportFinishTimeAssigned) || "N/A"}</div>
                <div><strong>Assigned To:</strong> {assignedAggregator}</div>
              </div>
            </div>

            {/* Status & Checklists */}
            <div>
              <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>Status & Checklists</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ padding: "0.5rem", borderRadius: "4px", backgroundColor: "#f5f5f5" }}>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>Aadhaar Status</div>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontWeight: "500",
                        fontSize: "0.85rem",
                        ...getAadhaarStatusBadge(ticket.aadhaarVerificationStatus),
                      }}
                    >
                      {ticket.aadhaarVerificationStatus || "N/A"}
                    </span>
                  </div>
                  <div style={{ padding: "0.5rem", borderRadius: "4px", backgroundColor: "#f5f5f5" }}>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>Current Status</div>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontWeight: "500",
                        fontSize: "0.85rem",
                        ...getStatusBadgeStyle(ticket.status),
                      }}
                    >
                      {ticket.status || "N/A"}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  <Badge label="GSM" status={ticket.gsmChecklist} />
                  <Badge label="GPS" status={ticket.gpsChecklist} />
                  <Badge label="Power" status={ticket.mainPowerChecklist} />
                  <Badge label="Battery" status={ticket.batteryBackupStatus} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: ticket.xconicsValidation ? "#2e7d32" : "#c62828" }} />
                  <span style={{ fontWeight: "500" }}>
                    Xconics Validation: {ticket.xconicsValidation ? "✓ Validated" : "✗ Not Validated"}
                  </span>
                </div>

                <div style={{ padding: "0.5rem", borderRadius: "4px", backgroundColor: "#f5f5f5" }}>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>Completed</div>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontWeight: "500",
                      fontSize: "0.85rem",
                      backgroundColor: ticket.completedAt ? "#e8f5e9" : "#ffebee",
                      color: ticket.completedAt ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {ticket.completedAt ? `Yes (${formatDateTime(ticket.completedAt)})` : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {ticket.remarks && (
              <div style={{ gridColumn: "1 / -1" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "#333" }}>Remarks</h4>
                <div style={{
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  borderLeft: "4px solid #1976d2",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6"
                }}>
                  {ticket.remarks}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="secondary" 
            onClick={onClose}
            style={{
              backgroundColor: "#f5f5f5",
              color: "#666",
              padding: "0.75rem 1.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Badge Component
function Badge({ label, status }) {
  return (
    <div style={{ padding: "0.5rem", borderRadius: "4px", backgroundColor: "#f9f9f9" }}>
      <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem" }}>{label}</div>
      <span
        style={{
          padding: "0.2rem 0.4rem",
          borderRadius: "3px",
          fontSize: "0.75rem",
          fontWeight: "500",
          ...getChecklistBadge(status === "OK" ? "PASS" : status),
        }}
      >
        {status || "N/A"}
      </span>
    </div>
  );
}
