import { Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaDoorOpen,
  FaUsers,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role; // "Admin" | "Tenant"

  return (
    <div className="p-3">
      <h6 className="mb-3 text-muted">Menu</h6>

      <Nav className="flex-column gap-1">
        {/* Admin Menu */}
        {role === "Admin" && (
          <>
            <Nav.Link as={Link} to="/admin/dashboard">
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/buildings">
              <FaBuilding className="me-2" />
              Buildings
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/rooms">
              <FaDoorOpen className="me-2" />
              Rooms
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/tenants">
              <FaUsers className="me-2" />
              Tenants
            </Nav.Link>

            <Nav.Link as={Link} to="/admin/payments">
              <FaMoneyBillWave className="me-2" />
              Payments
            </Nav.Link>
          </>
        )}

        {/* Tenant Menu */}
        {role === "Tenant" && (
          <>
            <Nav.Link
              as={NavLink}
              to="/tenant/dashboard"
              className={({ isActive }) =>
                isActive ? "fw-bold text-primary" : ""
              }
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/tenant/my-room"
              className={({ isActive }) =>
                isActive ? "fw-bold text-primary" : ""
              }
            >
              <FaDoorOpen className="me-2" />
              My Room
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/tenant/payments"
              className={({ isActive }) =>
                isActive ? "fw-bold text-primary" : ""
              }
            >
              <FaMoneyBillWave className="me-2" />
              My Payments
            </Nav.Link>
          </>
        )}

        {/* Common */}
        <Nav.Link as={Link} to="/profile">
          <FaUser className="me-2" />
          Profile
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
