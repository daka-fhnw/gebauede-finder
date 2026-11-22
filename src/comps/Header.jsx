import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
  return (
    <Navbar expand="lg" className="navbar navbar-dark bg-primary sticky-top">
      <Container>
        <Navbar.Brand>Gebäudefinder</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
