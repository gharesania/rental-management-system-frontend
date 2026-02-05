import { useEffect, useState } from "react";
import { Button, Card, Modal, Form, Row, Col, Table } from "react-bootstrap";
import { FaPlus, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import {
  createBuilding,
  getAllBuildings,
  deleteBuilding,
  updateBuilding,
} from "../../api/buildingAPI";

import { getBuildingRoomStats } from "../../api/roomAPI";
import buildingImage from "../../assets/Images/Building.jpg";

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomStats, setRoomStats] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Add Building Modal States
  const [showModal, setShowModal] = useState(false);

  // Edit Building Modal States
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete Building Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactEmail: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchBuildings();
    fetchRoomStats();
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await getAllBuildings();
      setBuildings(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch buildings");
    }
  };

  const fetchRoomStats = async () => {
    try {
      const res = await getBuildingRoomStats();
      setRoomStats(res.data.data);
    } catch {
      toast.error("Failed to fetch room stats");
    }
  };

  const getStatsByBuilding = (buildingId) => {
    return roomStats.find((s) => s.buildingId === buildingId);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, address, contactEmail, contactNumber } = formData;

    if (!name || !address || !contactEmail || !contactNumber) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await createBuilding(formData);

      toast.success("Building created successfully");

      setShowModal(false);
      setFormData({
        name: "",
        address: "",
        contactEmail: "",
        contactNumber: "",
      });

      fetchBuildings();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to create building");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Buildings</h3>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Building
        </Button>
      </div>

      {/* Buildings List */}
      <Row>
        {buildings.length === 0 ? (
          <p>No buildings found</p>
        ) : (
          buildings.map((b) => {
            const stats = getStatsByBuilding(b._id);

            return (
              <Col md={4} className="mb-4" key={b._id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={buildingImage}
                    height="200"
                    style={{ objectFit: "cover" }}
                  />

                  <Card.Body>
                    <h5 className="mb-1">
                      <FaBuilding className="me-2 text-primary" />
                      {b.name}
                    </h5>

                    <p className="text-muted mb-2">{b.address}</p>

                    <hr />

                    <div className="d-flex justify-content-between mb-1">
                      <span>Total Rooms</span>
                      <strong>{stats?.totalRooms || 0}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1 text-success">
                      <span>Available</span>
                      <strong>{stats?.available || 0}</strong>
                    </div>

                    <div className="d-flex justify-content-between mb-1 text-danger">
                      <span>Occupied</span>
                      <strong>{stats?.occupied || 0}</strong>
                    </div>

                    <div className="d-flex justify-content-between text-warning">
                      <span>Maintenance</span>
                      <strong>{stats?.maintenance || 0}</strong>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-white border-0 d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => {
                        setSelectedBuilding(b);
                        setFormData({
                          name: b.name,
                          address: b.address,
                          contactEmail: b.contactEmail,
                          contactNumber: b.contactNumber,
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={() => {
                        setSelectedBuilding(b);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {/* Add Building Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Building</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Building Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter building name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter number"
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

      {/* Edit Building Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Building</Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            await updateBuilding(selectedBuilding._id, formData);
            toast.success("Building updated");
            setShowEditModal(false);
            fetchBuildings();
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Building Name</Form.Label>
              <Form.Control
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Email</Form.Label>
              <Form.Control
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Building Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Building</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedBuilding?.name}</strong>?
          <br />
          <small className="text-muted">This action can be undone later.</small>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await deleteBuilding(selectedBuilding._id);
              toast.success("Building deleted");
              setShowDeleteModal(false);
              fetchBuildings();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Buildings;
