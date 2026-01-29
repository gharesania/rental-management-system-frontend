import { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert } from "react-bootstrap";
import Layout from "../../components/Layout";
import { getAllTenants } from "../../api/userAPI";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await getAllTenants();
      setTenants(res.data.data);
    } catch (err) {
      setError("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const query = search.toLowerCase();

    return (
      tenant.name?.toLowerCase().includes(query) ||
      tenant.email?.toLowerCase().includes(query) ||
      tenant.contactNumber?.includes(query)
    );
  });

  return (
    <Layout>
      <h3 className="mb-3">Tenants</h3>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email or contact number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!loading && !error && (
        <Card>
          <Card.Body>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Room</th>
                  <th>Building</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {tenants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No tenants found
                    </td>
                  </tr>
                ) : (
                  tenants.map((tenant, index) => (
                    <tr key={tenant._id}>
                      <td>{index + 1}</td>
                      <td>{tenant.name}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.contactNumber}</td>

                      <td>
                        {tenant.assignedRoom
                          ? tenant.assignedRoom.roomNumber
                          : "-"}
                      </td>

                      <td>{tenant.assignedRoom?.building?.name || "-"}</td>

                      <td>
                        <span
                          className={`badge ${
                            tenant.assignedRoom ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {tenant.assignedRoom ? "Assigned" : "Unassigned"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Layout>
  );
};

export default Tenants;
