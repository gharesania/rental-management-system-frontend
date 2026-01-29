import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import Layout from "../../components/Layout";
import { getDashboardStats } from "../../api/dashboardAPI";
import {
  FaBuilding,
  FaDoorOpen,
  FaCheckCircle,
  FaUserFriends,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h3 className="mb-4">Admin Dashboard</h3>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {stats && (
        <Row>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <FaBuilding size={26} className="mb-2 text-primary" />
                <h6>Total Buildings</h6>
                <h3>{stats.totalBuildings}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <FaDoorOpen size={26} className="mb-2 text-dark" />
                <h6>Total Rooms</h6>
                <h3>{stats.totalRooms}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <FaUserFriends size={26} className="mb-2 text-warning" />
                <h6>Total Tenants</h6>
                <h3>{stats.totalTenants}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <FaCheckCircle size={26} className="mb-2 text-success" />
                <h6>Available Rooms</h6>
                <h3>{stats.availableRooms}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <FaDoorOpen size={26} className="mb-2 text-danger" />
                <h6>Occupied Rooms</h6>
                <h3>{stats.occupiedRooms}</h3>
              </Card.Body>
            </Card>
          </Col>

          
        </Row>
      )}
    </Layout>
  );
};

export default AdminDashboard;
