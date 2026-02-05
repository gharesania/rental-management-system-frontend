import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Alert, Spinner } from "react-bootstrap";
import Layout from "../../components/Layout";
import { getTenantDashboard } from "../../api/tenantAPI";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getTenantDashboard();
      setData(res.data.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Spinner animation="border" />
      </Layout>
    );
  }

  if (!data || !data.hasRoom) {
    return (
      <Layout>
        <Alert variant="info">
          {data?.message || "No room assigned yet"}
        </Alert>
      </Layout>
    );
  }

  const { room, paymentSummary } = data;

  return (
    <Layout>
      <h3 className="mb-4">Tenant Dashboard</h3>

      {/* Room Info */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">My Room</h5>

          <Row>
            <Col md={4}>
              <strong>Building:</strong> {room.building.name}
            </Col>
            <Col md={4}>
              <strong>Room:</strong> {room.roomNumber}
            </Col>
            <Col md={4}>
              <strong>Floor:</strong> {room.floor || "-"}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <strong>Rent:</strong> ₹ {room.rent}
            </Col>
            <Col md={4}>
              <strong>Deposit:</strong> ₹ {room.deposit}
            </Col>
            <Col md={4}>
              <strong>Occupied From:</strong>{" "}
              {new Date(room.occupiedFrom).toLocaleDateString()}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payment Summary */}
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Total Rent</h6>
              <h4>₹ {paymentSummary.totalRent}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Total Paid</h6>
              <h4>₹ {paymentSummary.totalPaid}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Due Amount</h6>
              <h4>
                <Badge bg={paymentSummary.dueAmount > 0 ? "danger" : "success"}>
                  ₹ {paymentSummary.dueAmount}
                </Badge>
              </h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Last Payment */}
      {paymentSummary.lastPayment && (
        <Card className="mt-4">
          <Card.Body>
            <h5>Last Payment</h5>
            <Row>
              <Col md={4}>
                <strong>Month:</strong> {paymentSummary.lastPayment.month}
              </Col>
              <Col md={4}>
                <strong>Paid:</strong> ₹{" "}
                {paymentSummary.lastPayment.paidAmount}
              </Col>
              <Col md={4}>
                <strong>Status:</strong>{" "}
                <Badge
                  bg={
                    paymentSummary.lastPayment.status === "Paid"
                      ? "success"
                      : paymentSummary.lastPayment.status === "Partial"
                      ? "warning"
                      : "danger"
                  }
                >
                  {paymentSummary.lastPayment.status}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
};

export default TenantDashboard;
