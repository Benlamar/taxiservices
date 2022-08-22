import { Navbar, Nav, Container } from 'react-bootstrap';
import {Link} from "react-router-dom";
import "./navbar.css"

function TaxiNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className='sticky-top'>
      <Container>
        <Navbar.Brand >
        <img src='./image/taxi.png' alt='logo' className='brand-logo'/>
        Taxi and Booking</Navbar.Brand>
          <Nav className="me-auto m-0">
            <Link className='links' to="/">Home</Link>
          </Nav>
      </Container>
    </Navbar>
  );
}

export default TaxiNavbar;