import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import {
  getAllPayments,
  addPayment,
  updatePayment,
} from "../../api/paymentAPI";
import { getAllTenants } from "../../api/userAPI";
import { getAllRooms } from "../../api/roomAPI";
import { FaPlus, FaEdit } from "react-icons/fa";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [formData, setFormData] = useState({
    tenant: "",
    room: "",
    building: "",
    month: "",
    paidAmount: "",
    paymentMode: "Cash",
    paymentDate: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchTenants();
    fetchRooms();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      setPayments(res.data.data);
    } catch {
      toast.error("Failed to fetch payments");
    }
  };

  const fetchTenants = async () => {
    const res = await getAllTenants();
    setTenants(res.data.data);
  };

  const fetchRooms = async () => {
    const res = await getAllRooms();
    setRooms(res.data.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "room") {
      const selectedRoom = rooms.find((r) => r._id === value);

      setFormData({
        ...formData,
        room: value,
        building: selectedRoom?.building?._id || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add Payment
  const handleAddPayment = async () => {
    try {
      if (
        !formData.tenant ||
        !formData.room ||
        !formData.month ||
        formData.paidAmount === ""
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      await addPayment(formData);
      toast.success("Payment added");
      setShowAddModal(false);
      setFormData({
        tenant: "",
        room: "",
        building: "",
        month: "",
        paidAmount: "",
        paymentMode: "Cash",
        paymentDate: "",
      });
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add payment");
    }
  };

  // Edit Payment
  const handleEditPayment = async () => {
    try {
      await updatePayment(selectedPayment._id, {
        paidAmount: formData.paidAmount,
        paymentMode: formData.paymentMode,
        paymentDate: formData.paymentDate,
      });
      toast.success("Payment updated");
      setShowEditModal(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch {
      toast.error("Failed to update payment");
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Payments</h3>
        <Button onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" /> Add Payment
        </Button>
      </div>

      {/* Payments Table */}
      <Card>
        <Card.Body>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Building</th>
                <th>Room</th>
                <th>Month</th>
                <th>Rent</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.tenant?.name}</td>
                    <td>{p.building?.name}</td>
                    <td>{p.room?.roomNumber}</td>
                    <td>{p.month}</td>
                    <td>₹ {p.rentAmount}</td>
                    <td>₹ {p.paidAmount}</td>
                    <td>
                      <Badge
                        bg={
                          p.status === "Paid"
                            ? "success"
                            : p.status === "Partial"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          setSelectedPayment(p);
                          setFormData({
                            paidAmount: p.paidAmount,
                            paymentMode: p.paymentMode,
                            paymentDate: p.paymentDate?.slice(0, 10),
                          });
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Payment Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Select className="mb-2" name="tenant" onChange={handleChange}>
              <option value="">Select Tenant</option>
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>

            <Form.Select className="mb-2" name="room" onChange={handleChange}>
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.roomNumber} ({r.building?.name})
                </option>
              ))}
            </Form.Select>

            <Form.Control
              className="mb-2"
              value={
                rooms.find((r) => r._id === formData.room)?.building?.name || ""
              }
              disabled
            />

            <Form.Control
              className="mb-2"
              type="month"
              name="month"
              onChange={handleChange}
            />

            <Form.Control
              className="mb-2"
              name="paidAmount"
              placeholder="Paid Amount"
              onChange={handleChange}
            />

            <Form.Select
              className="mb-2"
              name="paymentMode"
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </Form.Select>

            <Form.Control
              type="date"
              name="paymentDate"
              onChange={handleChange}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPayment}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Payment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
            />

            <Form.Select
              className="mb-2"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
            </Form.Select>

            <Form.Control
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditPayment}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Payments;
