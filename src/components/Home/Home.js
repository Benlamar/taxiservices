import React from 'react'
import {Link} from "react-router-dom";
import { Button, Container, Row, Col} from 'react-bootstrap';
import "./home.css";

const Home = () => {
  return (
    <div className='home'>
        <Container fluid className='h-100'>
            <Row className='h-100 d-flex'>
                <Col sm={8} className='p-0'>
                    <img src="./image/pexels-dario-fernandez-ruz-6440616.jpg" alt="" className='vh-100 w-100'/>
                </Col>

                <Col sm={4} className='d-flex flex-column justify-content-start align-items-center'>
                    <h2 class='title'>Welcome to Taxi Booking</h2>
                    <p>Go to taxi page for registration</p>
                    <Link to="/taxi"><Button className="btn-size border-0">Taxi</Button></Link>
                    
                    <p>Go to taxi page for registration</p>
                    <Link to="/customer"><Button className="btn-size border-0">Customer</Button></Link>
                </Col>
            </Row>
        </Container>
        
    </div>
  )
}

export default Home