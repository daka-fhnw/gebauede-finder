import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Header({ page, setPage }) {
  return (
    <Navbar expand="lg" className="navbar navbar-dark bg-primary sticky-top">
      <Container>
        <Navbar.Brand>Gebäudefinder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link active={page === 0} onClick={() => setPage(0)}>
              Bilder
            </Nav.Link>
            <Nav.Link active={page === 1} onClick={() => setPage(1)}>
              Daten
            </Nav.Link>
            <Nav.Link active={page === 2} onClick={() => setPage(2)}>
              Abfrage
            </Nav.Link>
            <Nav.Link active={page === 3} onClick={() => setPage(3)}>
              Kontrolle
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
