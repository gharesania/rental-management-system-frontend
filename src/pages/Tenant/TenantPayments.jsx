import { useEffect, useState } from "react";
import { Table, Badge, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { getMyPayments } from "../../api/paymentAPI";

const TenantPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getMyPayments();
      setPayments(res.data.data);
    } catch (error) {
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "PAID") return <Badge bg="success">Paid</Badge>;
    if (status === "PARTIAL") return <Badge bg="warning">Partial</Badge>;
    return <Badge bg="danger">Due</Badge>;
  };

  return (
    <Layout>
      <h3 className="mb-3">My Payment History</h3>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-muted">No payments found</p>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Building</th>
                  <th>Room</th>
                  <th>Rent</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Payment Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.month}</td>
                    <td>{p.building?.name}</td>
                    <td>{p.room?.roomNumber}</td>
                    <td>₹{p.rentAmount}</td>
                    <td>₹{p.paidAmount}</td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td>{p.paymentMode}</td>
                    <td>
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default TenantPayments;
