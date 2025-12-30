import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  LogOut,
  Layers,        // Aggregator
  Building2,     // Lender Branch
  Wrench,        // Field Engineer
  Warehouse      // Warehouse
} from "lucide-react";
import "./Sidebar.css";

// Brand assets
//import xconicsMini from "../assets/xconics mini logo.jpeg";
//import xconicsText from "../assets/Xconics_logo_blue (3).png";

export default function Sidebar({ isOpen, isMobile, closeSidebar }) {
  const user = {
    name: "Lisa Roy",
    role: "Designer",
  };

  const handleNavClick = () => {
    if (isMobile) closeSidebar();
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : "collapsed"} ${isMobile ? "mobile" : ""
        }`}
    >
      {/* ===== BRAND ===== */}
      <div className="brand">
  {isOpen && <span className="brand-text">Aggregator</span>}
  {!isOpen && <span className="brand-text-collapsed">Aggregator</span>}
</div>

      {/* ===== NAV ===== */}
      <nav className="nav">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Home size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Dashboard</span>}
        </NavLink>

        

        {/* Aggregator 
        <NavLink
          to="/aggregators"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Layers size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Aggregator</span>}
        </NavLink>*/}

        {/* Field Engineer */}
        <NavLink
          to="/engineers"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Wrench size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Field Engineer</span>}
        </NavLink>

        {/* Warehouse */}
        <NavLink
          to="/warehouse"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Warehouse size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Warehouse</span>}
        </NavLink>
        {/* Warehouse */}
        
        {/* Device */}
        <NavLink
          to="/devices"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Building2 size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Devices</span>}
        </NavLink>
<NavLink
          to="/device-movement"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          onClick={handleNavClick}
        >
          <span className="nav-icon">
            <Building2 size={20} strokeWidth={1.8} />
          </span>
          {isOpen && <span className="nav-label">Device Movement</span>}
        </NavLink>

        
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>

          {isOpen && (
            <div className="user-text">
              <strong>{user.name}</strong>
              <p>{user.role}</p>
            </div>
          )}
        </div>

        {isOpen && (
          <button className="signout-btn" aria-label="Sign out">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
