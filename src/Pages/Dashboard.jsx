import { useState, useMemo } from "react";
import "./Dashboard.css";

const TICKETS = [
  { id: 201, title: "Login issue", createdBy: "Pineapple Inc.", assignedTo: "Support A", cost: 90, status: "Accepted" },
  { id: 202, title: "Payment failure", createdBy: "ME Inc.", assignedTo: "Support B", cost: 120, status: "Pending" },
  { id: 203, title: "UI bug", createdBy: "Redq Inc.", assignedTo: "Support C", cost: 70, status: "Closed" },
  { id: 204, title: "API timeout", createdBy: "Acme Corp.", assignedTo: "Support A", cost: 150, status: "Rejected" },
  { id: 205, title: "Report issue", createdBy: "Globex", assignedTo: "Support B", cost: 60, status: "Accepted" },
];

export default function Dashboard() {
  const [filter, setFilter] = useState("ALL");

  /* ================= FILTERED DATA ================= */
  const filteredTickets = useMemo(() => {
    if (filter === "ALL") return TICKETS;
    return TICKETS.filter((t) => t.status === filter);
  }, [filter]);

  /* ================= COUNTS ================= */
  const counts = useMemo(() => {
    return {
      total: TICKETS.length,
      pending: TICKETS.filter(t => t.status === "Pending").length,
      accepted: TICKETS.filter(t => t.status === "Accepted").length,
      rejected: TICKETS.filter(t => t.status === "Rejected").length,
      closed: TICKETS.filter(t => t.status === "Closed").length,
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>All Tickets</h2>
          <p className="breadcrumb">Home • Tickets</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">
        <SummaryCard title="Total" value={counts.total} color="blue" onClick={() => setFilter("ALL")} active={filter === "ALL"} />
        <SummaryCard title="Pending" value={counts.pending} color="orange" onClick={() => setFilter("Pending")} active={filter === "Pending"} />
        <SummaryCard title="Accepted" value={counts.accepted} color="green" onClick={() => setFilter("Accepted")} active={filter === "Accepted"} />
        <SummaryCard title="Rejected" value={counts.rejected} color="red" onClick={() => setFilter("Rejected")} active={filter === "Rejected"} />
        <SummaryCard title="Closed" value={counts.closed} color="teal" onClick={() => setFilter("Closed")} active={filter === "Closed"} />
      </div>

      {/* FILTER BUTTONS */}
      <div className="dashboard-filters">
        {["ALL", "Pending", "Accepted", "Rejected", "Closed"].map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TICKET TABLE */}
      <div className="ticket-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Created By</th>
              <th>Assigned To</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.createdBy}</td>
                <td>{t.assignedTo}</td>
                <td>{t.cost}</td>
                <td>
                  <span className={`status-pill ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="empty">No tickets found</div>
        )}
      </div>
    </div>
  );
}

/* ================= SUMMARY CARD ================= */
function SummaryCard({ title, value, color, onClick, active }) {
  return (
    <div
      className={`summary-card ${color} ${active ? "active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <h4>{title}</h4>
      <p>{value} Tickets</p>
    </div>
  );
}
