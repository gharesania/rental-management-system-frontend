import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      {/* Top Navbar */}
      <AppNavbar />

      {/* Sidebar + Content */}
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="p-0 border-end">
            <Sidebar />
          </Col>

          {/* Main Content */}
          <Col xs={12} md={9} lg={10} className="p-4">
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Layout;
