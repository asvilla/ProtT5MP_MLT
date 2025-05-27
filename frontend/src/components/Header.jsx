// src/components/Header.js
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import logo from '../images/Logo_ProtT5MP.PNG'; // Add this image to your project


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
          {' '} ProtT5MP
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Inicio</Nav.Link>
          {/* <Nav.Link href="/technical">Technical Details</Nav.Link> */}
          <Nav.Link href="/prediction">Hacer Predicción</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Proyecto de Análisis de Proteínas con ML
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;