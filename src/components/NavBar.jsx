import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const AppNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        {/* <Navbar.Brand>Apartment Rental Management System</Navbar.Brand> */}
        <Navbar.Brand>Rentify</Navbar.Brand>

        <Button variant="outline-light" onClick={logout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
