// src/components/Header.js
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../images/protein-logo.jpg'; // Add this image to your project

const Header = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/"> 
          <img
            src={logo} 
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
          {' '} Protein Stability Predictor
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/technical">Technical Details</Nav.Link>
          <Nav.Link href="/prediction">Make Prediction</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            ML Protein Analysis Project
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;