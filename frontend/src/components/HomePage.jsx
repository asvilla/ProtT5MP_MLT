// src/components/HomePage.js
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';

//import proteinBanner from '/src/images/model-architecture.png'; // Add this image

import proteinBanner from '../images/model-architecture.png';

const HomePage = () => {
  const [show, setShow] = useState(false);

  // Functions for modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="home-page" style={{ marginBottom: 50 }}>
      <Row className="justify-content-center">
        <Col sm="8" className="text-center">
          <h1 className="banner">Welcome to Protein Thermal Stability Predictor</h1>
        </Col>
        <hr className="custom-hr" />
        
        {/* Protein image with button overlay */}
        <Col sm="5" style={{ position: 'relative', marginBottom: '50px' }}>
          <Image src={proteinBanner} alt="Protein Structure" fluid />
          
          {/* Centered round button */}
          <Button
  onClick={handleShow}
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343a40',
    color: '#f8f9fa',
    border: 'none',
    animation: 'pulse 1.5s infinite',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)'
  }}
>
  Welcome!
</Button>
        </Col>
      </Row>

      {/* Project description card */}
      <Row className="justify-content-center mt-4">
        <Col sm="8">
          <Card>
            <Card.Body>
              <Card.Title style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Protein Thermal Stability Analysis Project
              </Card.Title>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                Protein thermal stability is an important parameter for understanding protein function, designing protein-based therapeutics, and improving the stability of enzymes used in industrial processes.
              </Card.Text>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                Our machine learning model uses advanced deep learning techniques to analyze amino acid sequences and predict the melting point temperature of proteins. This helps researchers engineer more stable proteins and understand the relationship between sequence and thermal properties.
              </Card.Text>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                <strong>User Story:</strong> "As a researcher working with proteins, I want to predict the thermal stability of my protein sequences, so that I can understand their behavior under different temperature conditions and engineer more stable variants."
              </Card.Text>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                <strong>Target Users:</strong> The application is designed for biochemists, protein engineers, pharmaceutical researchers, and biotechnology companies working with proteins and enzymes.
              </Card.Text>
              <Card.Text style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>
                We invite you to explore the application and make predictions for your protein sequences!
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Space at bottom of page */}
          <div style={{ marginBottom: '80px' }}></div>
        </Col>
      </Row>

      {/* Welcome Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to the Protein Stability Predictor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This application allows you to predict the thermal stability of protein sequences using our advanced machine learning model.
            Use the navigation menu to explore the technical details or go directly to the prediction page to analyze your sequences.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Animation styles */}
      <style type="text/css">
        {`
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              box-shadow: 0 0 25px rgba(52, 58, 64, 0.5);
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
          }
        `}
      </style>
    </Container>
  );
};

export default HomePage;