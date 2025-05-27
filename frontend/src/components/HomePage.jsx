// src/components/HomePage.js
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';

//import proteinBanner from '/src/images/model-architecture.png'; // Add this image

import proteinBanner from '../images/Logo_ProtT5MP.png';

const HomePage = () => {
  //const [show, setShow] = useState(false);

  // Functions for modal
  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  return (
    <Container className="home-page" style={{ marginBottom: 50 }}>
      <Row className="justify-content-center">
        <Col sm="8" className="text-center">
          <h1 className="banner">Bienvenidos a ProtT5MP</h1>
        </Col>
        <hr className="custom-hr" />
        
        {/* Protein image with button overlay */}
        <Col sm="5" style={{ position: 'relative', marginBottom: '50px' }}>
          <Image src={proteinBanner} alt="Protein Structure" fluid />
          
          {/* Centered round button */}
          {/* <Button
  //onClick={handleShow}
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
</Button> */}
        </Col>
      </Row>

      {/* Project description card */}
      <Row className="justify-content-center mt-4">
        <Col sm="8">
          <Card>
            <Card.Body>
              <Card.Title style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Proyecto de Análisis de Estabilidad Térmica de Proteínas
              </Card.Title>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                La predicción de la estabilidad térmica de proteínas, en particular de la temperatura de fusión (Tm), ha sido de gran importancia para aplicaciones en biotecnología, farmacología e ingeniería de enzimas. Aunque existen modelos computacionales que permiten estimar este valor, la mayoría de los enfoques previos se han basado exclusivamente en información derivada de la secuencia de aminoácidos. 
              </Card.Text>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem',  }}>
                En este trabajo, se propuso integrar datos derivados de la estructura tridimensional de proteínas, evaluando su utilidad mediante un enfoque exploratorio basado en aprendizaje automático. Se utilizó un conjunto de 29.779 proteínas con secuencias disponibles, y se obtuvo información estructural a partir de la base de datos AlphaFold. A partir de estos datos, se generaron representaciones vectoriales (embeddings) tanto de secuencia como de estructura, que fueron empleadas como entrada para diferentes modelos de regresión, tanto de forma individual como en combinaciones secuencia-estructura. 
              </Card.Text>
              <Card.Text style={{ textAlign: 'justify', fontSize: '1.2rem' }}>
                Los resultados iniciales mostraron que, si bien la inclusión de información estructural permitió mejorar el desempeño  de los modelos  al ser concatenados con ciertos embeddings de secuencia, el mejor desempeño se observó con un embedding de secuencia únicamente: ProtT5-XL-U50, que superó tanto a las representaciones individuales como a las combinadas. A partir de estos hallazgos, se seleccionó dicho modelo y se implementó una estrategia de fine-tuning utilizando LoRA, lo cual permitió alcanzar un coeficiente de determinación (R²) de 0.91 y un error absoluto medio (MAE) de 3.72 °C, en comparación con un modelo de referencia previo que reportaba valores de 0.77 y 6.44 °C, respectivamente. Finalmente, el modelo optimizado fue desplegado como una aplicación web interactiva.  
              </Card.Text>

              <Card.Text style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <strong>Historia de Usuario:</strong> "Como investigador que trabaja con proteínas, quiero predecir la estabilidad térmica de mis secuencias de proteínas, para poder entender su comportamiento bajo diferentes condiciones de temperatura y diseñar variantes más estables."
              </Card.Text>

              
              <Card.Text style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold' }}>
                Te invitamos a explorar la aplicación y hacer predicciones para tus secuencias de proteínas!

              </Card.Text>
            </Card.Body>
          </Card>

          {/* Space at bottom of page */}
          <div style={{ marginBottom: '80px' }}></div>
        </Col>
      </Row>

      {/* Welcome Modal */}
      {/* <Modal show={show} onHide={handleClose}>
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
      </Modal> */}

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