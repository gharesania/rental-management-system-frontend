import { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import {
  getUserProfile,
  updateProfile,
} from "../../api/userAPI";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    currentAddress: "",
    permanentAddress: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      const userData = res.data.user;

      setUser(userData);
      setFormData({
        name: userData.name || "",
        contactNumber: userData.contactNumber || "",
        currentAddress: userData.currentAddress || "",
        permanentAddress: userData.permanentAddress || "",
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateProfile(formData);
      setUser(res.data.user);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      contactNumber: user.contactNumber || "",
      currentAddress: user.currentAddress || "",
      permanentAddress: user.permanentAddress || "",
    });
    setEditMode(false);
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Profile</h3>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* VIEW MODE */}
      {!editMode && user && (
        <Card>
          <Card.Body>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Contact Number:</strong>{" "}
              {user.contactNumber || "-"}
            </p>
            <p>
              <strong>Current Address:</strong>{" "}
              {user.currentAddress || "-"}
            </p>
            <p>
              <strong>Permanent Address:</strong>{" "}
              {user.permanentAddress || "-"}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <Badge bg="info">{user.role}</Badge>
            </p>
          </Card.Body>
        </Card>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <Card>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Permanent Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
};

export default Profile;
