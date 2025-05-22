// src/components/PredictionPage.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Bar } from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/Tooltip';
import Tooltip from 'react-bootstrap/Tooltip';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const PredictionPage = () => {
  const [sequence, setSequence] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSequenceChange = (e) => {
    setSequence(e.target.value);
    if (e.target.value.trim() === '') {
      setError('Sequence cannot be empty');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (sequence.trim() === '') {
      setError('Please enter a protein sequence');
      return;
    }
    
    setLoading(true);
    setError(''); // Clear previous errors
    setResults(null); // Clear previous results
    
    try {
        const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein_sequence: sequence,
        }),
      });
  
      if (!response.ok) {
        let errorDetail = 'Error al realizar la predicción'; // Default error
        try {
          // Try to parse a JSON error response from the backend
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail; // Use backend-provided error message
          }
        } catch {
          // If parsing JSON fails, use status text or a generic message
          errorDetail = `Error: ${response.status} ${response.statusText || 'Network response was not ok'}`;
        }
        throw new Error(errorDetail);
      }
  
      const data = await response.json();
      console.log('Respuesta del Servidor:', data);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="prediction-container">
      <Row className="justify-content-center text-center mt-5">
        <Col xs={12}>
          <h1 className="banner" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Protein Stability Prediction Tool
          </h1>
        </Col>
      </Row>

      {/* Explanation Box */}
      <Row className="justify-content-center">
        <Col xs={10} md={8} className="text-center mt-3">
          <div className="info-box">
            <h4>How does the Prediction Work?</h4>
            <p>
              Enter your protein sequence in FASTA format below, and our machine learning model will analyze it
              to predict the melting temperature. The model examines patterns in the amino acid sequence that
              correlate with thermal stability.
            </p>
          </div>
        </Col>
      </Row>

      {/* Sequence Input Form */}
      <Row className="justify-content-center mt-4">
        <Col xs={10} md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Protein Sequence (FASTA format)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={6} 
                value={sequence}
                onChange={handleSequenceChange}
                placeholder=">example_protein\nMKVLILACLVALALARELEELNVPGEIVESLSSS..."
                className={error ? 'is-invalid' : ''}
                style={{ fontFamily: 'monospace' }}
              />
              {error && <div className="text-danger mt-1">{error}</div>}
              <Form.Text className="text-muted">
                Input your protein sequence in FASTA format or as raw amino acid sequence.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Processing...' : 'Predict Stability'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      
      {/* Results Section */}
      {results && !loading && (
        <Row className="justify-content-center mt-5">
          <Col xs={10} md={8}>
            <Card className="results-card">
              <Card.Header as="h5" className="text-center bg-primary text-white">
                Prediction Results
              </Card.Header>
              <Card.Body>
                <Row className='justify-content-center'>
                  {/* Temperature Result */}
                  <Col md={6} className="text-center mb-4">
                    <h3>Predicted Melting Temperature</h3>
                    <div className="temperature-display" style={{ 
                      fontSize: '3rem', 
                      fontWeight: 'bold',
                      color: '#007bff',                      
                    }}>
                      {results.predicted_tm.toFixed(2)}°C
                    </div>
                    {/*<p className="mt-2">Confidence Score: {(results.confidence_score * 100).toFixed(1)}%</p>*/}
                  </Col>

                  {/*<console className="log">{JSON.stringify(results, null, 2)}</console>*/}

                  {/* Chart */}
                  {/* <Col md={6}>
                    <h4 className="text-center mb-3">Stability Analysis</h4>
                    <Bar
                      data={{
                        labels: ['Low Temp', 'High Temp'],
                        datasets: [{
                          label: 'Probability Distribution',
                          data: results.probabilities,
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(255, 99, 132, 0.5)'
                          ],
                          borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 99, 132, 1)'
                          ],
                          borderWidth: 1
                        }]
                      }}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 1
                          }
                        }
                      }}
                    />
                  </Col> */}
                </Row>
                
                <hr />
                
                {/* Interpretation */}
                <div className="mt-4">
                  <h5>What does this mean?</h5>
                  <p>
                    The predicted melting temperature of {results.predicted_tm.toFixed(2)}°C indicates 
                    {parseFloat(results.predicted_tm) > 60 
                      ? ' a relatively high thermal stability. This protein should maintain its structure and function at elevated temperatures.'
                      : parseFloat(results.predicted_tm) > 45
                        ? ' a moderate thermal stability. This protein should be stable at room temperature but may denature at elevated temperatures.'
                        : ' a relatively low thermal stability. This protein may be sensitive to temperature changes and could denature easily.'
                    }
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Space at bottom of page */}
      <div style={{ marginBottom: '100px' }}></div>
    </Container>
  );
};

export default PredictionPage;