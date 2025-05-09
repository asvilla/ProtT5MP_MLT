// src/components/TechnicalDetailsPage.js
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import modelImage from '../images/model-architecture.png'; // Add this image

const TechnicalDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Model Image */}
      <Row className="justify-content-center">
        <Col xs={10} md={8} className="text-center mt-3">
          <img src={modelImage} alt="Model Architecture" style={{ maxWidth: '100%', height: 'auto' }} />
        </Col>
      </Row>

      {/* Main Title */}
      <h1 style={{ textAlign: 'center' }}>Technical Details of the Model</h1>
      
      {/* Explanation Box */}
      <Row className="justify-content-center">
        <Col xs={15} md={8} className="mt-3">
          <div className="info-box" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9', textAlign: 'justify' }}>
            <p>
              This project uses a deep learning model to predict protein thermal stability based on amino acid sequences. 
              The model incorporates convolutional neural networks (CNNs) to capture local sequence motifs and bidirectional 
              LSTMs to handle long-range interactions in the protein sequence.
            </p>
            <p>
              The model was trained on a curated dataset of over 10,000 protein sequences with experimentally determined 
              melting temperatures. The dataset covers diverse protein families and functions to ensure broad applicability.
            </p>
            <p>
              Our approach involves several key roles: data scientists responsible for building the analytical models 
              that predict thermal stability, data engineers ensuring proper implementation and updating of these models 
              for accuracy and efficiency, and software engineers developing the web interface for users to interact with the model.
            </p>

            {/* Performance Metrics Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mean Absolute Error</td>
                  <td>2.3°C</td>
                  <td>Average difference between predicted and actual melting temperatures</td>
                </tr>
                <tr>
                  <td>R² Score</td>
                  <td>0.87</td>
                  <td>Proportion of variance in melting temperature explained by the model</td>
                </tr>
                <tr>
                  <td>Cross-Validation Score</td>
                  <td>0.85</td>
                  <td>Model consistency across different data subsets</td>
                </tr>
              </tbody>
            </Table>

            {/* Additional Text */}
            <div style={{ textAlign: 'justify' }}>
              <p>
                <strong>Model Architecture:</strong> The model uses a combination of embedding layers to represent amino acids, 
                followed by convolutional layers to capture local patterns, and bidirectional LSTM layers to understand 
                sequence context. The final layers include dense networks that output the predicted melting temperature.
              </p>
              <p>
                <strong>Feature Engineering:</strong> Beyond the raw sequence, we extract additional features including amino 
                acid composition percentages, hydropathy index distribution, secondary structure propensities, and charge 
                distribution along the sequence.
              </p>
            </div>
          </div>

          {/* Space at bottom of page */}
          <div style={{ marginBottom: '40px' }}></div>
        </Col>
      </Row>

      {/* More space at page bottom */}
      <div style={{ marginBottom: '80px' }}></div>
    </div>
  );
};

export default TechnicalDetailsPage;