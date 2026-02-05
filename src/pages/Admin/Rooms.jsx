import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";
import Layout from "../../components/Layout";
import {
  getAllRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  assignTenantToRoom,
} from "../../api/roomAPI";
import { getAllBuildings } from "../../api/buildingAPI";
import { getAllTenants } from "../../api/userAPI";

const Rooms = () => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [occupiedFrom, setOccupiedFrom] = useState("");

  //   Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  //   Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Assign Tenant Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  // const [selectedRoom, setSelectedRoom] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");

  const [formData, setFormData] = useState({
    building: "",
    roomNumber: "",
    floor: "",
    rent: "",
    deposit: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
    fetchTenants();
  }, []);

  const fetchRooms = async (buildingId = "") => {
    try {
      const res = await getAllRooms(buildingId);
      setRooms(res.data.data);
    } catch {
      toast.error("Failed to fetch rooms");
    }
  };

  const fetchBuildings = async () => {
    try {
      const res = await getAllBuildings();
      setBuildings(res.data.data);
    } catch {
      toast.error("Failed to fetch buildings");
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await getAllTenants();
      setTenants(res.data.data);
    } catch {
      toast.error("Failed to fetch tenants");
    }
  };

  const handleBuildingFilter = (e) => {
    const value = e.target.value;
    setSelectedBuilding(value);
    fetchRooms(value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { building, roomNumber, rent, deposit } = formData;

    if (!building || !roomNumber || !rent || !deposit) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await createRoom(formData);
      toast.success("Room created successfully");

      setShowModal(false);
      setFormData({
        building: "",
        roomNumber: "",
        floor: "",
        rent: "",
        deposit: "",
      });

      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  //   Edit Modal Function
  const handleEditClick = (room) => {
    setEditingRoomId(room._id);
    setFormData({
      building: room.building?._id || "",
      roomNumber: room.roomNumber,
      floor: room.floor || "",
      rent: room.rent,
      deposit: room.deposit,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { building, roomNumber, rent, deposit } = formData;

    if (!building || !roomNumber || !rent || !deposit) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await updateRoom(editingRoomId, formData);

      toast.success("Room updated successfully");

      setShowEditModal(false);
      setEditingRoomId(null);
      setFormData({
        building: "",
        roomNumber: "",
        floor: "",
        rent: "",
        deposit: "",
      });

      fetchRooms(selectedBuilding);
    } catch (error) {
      toast.error("Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  //   Delete Modal Function
  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;

    try {
      await deleteRoom(selectedRoom._id);
      toast.success("Room deleted successfully");
      setShowDeleteModal(false);
      setSelectedRoom(null);
      fetchRooms(selectedBuilding);
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  // Assign Tenant To Room Modal
  const handleAssignClick = (room) => {
    setSelectedRoom(room);
    setSelectedTenant("");
    setShowAssignModal(true);
  };

  const handleAssignTenant = async () => {
    if (!selectedTenant) {
      toast.error("Please select a tenant");
      return;
    }

    try {
      await assignTenantToRoom({
        roomId: selectedRoom._id,
        tenantId: selectedTenant,
        occupiedFrom, // ✅ ADD THIS
      });

      toast.success("Tenant assigned successfully");

      setShowAssignModal(false);
      setSelectedRoom(null);
      setSelectedTenant("");
      setOccupiedFrom(""); // reset

      fetchRooms(selectedBuilding);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Assignment failed");
    }
  };

  const roomsByBuilding = rooms.reduce((acc, room) => {
    const buildingName = room.building?.name || "Unknown Building";

    if (!acc[buildingName]) {
      acc[buildingName] = [];
    }

    acc[buildingName].push(room);
    return acc;
  }, {});

  return (
    <Layout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Rooms</h3>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Room
        </Button>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Building</Form.Label>
                <Form.Select
                  value={selectedBuilding}
                  onChange={handleBuildingFilter}
                >
                  <option value="">All Buildings</option>
                  {buildings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Rooms Table */}
      {Object.keys(roomsByBuilding).length === 0 ? (
        <Card>
          <Card.Body className="text-center">No rooms found</Card.Body>
        </Card>
      ) : (
        Object.entries(roomsByBuilding).map(([buildingName, rooms]) => (
          <Card className="mb-4" key={buildingName}>
            <Card.Header className="fw-bold fs-5">{buildingName}</Card.Header>

            <Card.Body>
              <Row>
                {rooms.map((room) => (
                  <Col md={2} sm={4} xs={6} key={room._id} className="mb-3">
                    <Card
                      className="h-100 shadow-sm"
                      border={
                        room.status === "Available"
                          ? "success"
                          : room.status === "Occupied"
                            ? "danger"
                            : "warning"
                      }
                    >
                      <Card.Body>
                        <h4 className="fw-bold mb-1">Room {room.roomNumber}</h4>

                        <div className="text-muted small mb-2">
                          Floor: {room.floor || "-"}
                        </div>

                        <div className="fw-bold mb-2">₹ {room.rent}</div>

                        <Badge
                          bg={
                            room.status === "Available"
                              ? "success"
                              : room.status === "Occupied"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {room.status}
                        </Badge>

                        {room.status === "Occupied" && (
                          <div className="mt-2 small">
                            <div>
                              <strong>Tenant:</strong>{" "}
                              {room.tenant?.name || "-"}
                            </div>
                            <div className="text-muted">
                              Since:{" "}
                              {room.occupiedFrom
                                ? new Date(
                                    room.occupiedFrom,
                                  ).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        )}
                      </Card.Body>

                      <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                        {room.status === "Available" && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleAssignClick(room)}
                          >
                            <FaUserPlus />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleEditClick(room)}
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          disabled={room.status === "Occupied"}
                          onClick={() => handleDeleteClick(room)}
                        >
                          <FaTrash />
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Add Room Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Room</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Building</Form.Label>
              <Form.Select
                name="building"
                value={formData.building}
                onChange={handleChange}
              >
                <option value="">Select Building</option>
                {buildings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Floor</Form.Label>
                  <Form.Control
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rent</Form.Label>
                  <Form.Control
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deposit</Form.Label>
                  <Form.Control
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Assign Tenant To Room Modal */}
      <Modal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Tenant</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>Room:</strong> {selectedRoom?.roomNumber} (
            {selectedRoom?.building?.name})
          </p>

          <Form.Group>
            <Form.Label>Select Tenant</Form.Label>
            <Form.Select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name} ({tenant.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Occupied From</Form.Label>
            <Form.Control
              type="date"
              value={occupiedFrom}
              onChange={(e) => setOccupiedFrom(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssignTenant}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Room Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Room</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Building</Form.Label>
              <Form.Select
                name="building"
                value={formData.building}
                onChange={handleChange}
              >
                <option value="">Select Building</option>
                {buildings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Floor</Form.Label>
                  <Form.Control
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rent</Form.Label>
                  <Form.Control
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deposit</Form.Label>
                  <Form.Control
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Room Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete room{" "}
          <strong>{selectedRoom?.roomNumber}</strong>?
          <br />
          <small className="text-muted">
            This action can be reversed later.
          </small>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Rooms;
