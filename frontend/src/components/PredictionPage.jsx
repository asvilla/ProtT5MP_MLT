// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// // import { Bar } from 'react-chartjs-2'; // Uncomment if you use the chart
// // import OverlayTrigger from 'react-bootstrap/Tooltip'; // Uncomment if used
// // import Tooltip from 'react-bootstrap/Tooltip'; // Uncomment if used
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip as ChartTooltip,
//   // Legend // Uncomment if you use legend in charts
// } from 'chart.js';

// // Register ChartJS components if you use charts
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip /*, Legend */);

// const PredictionPage = () => {
//   const [sequence, setSequence] = useState('');
//   const [results, setResults] = useState(null); // For single sequence result
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null); // For FASTA file
//   const [multiResults, setMultiResults] = useState([]); // For results from FASTA file

//   const handleSequenceChange = (e) => {
//     setSequence(e.target.value);
//     if (e.target.value.trim() === '' && !selectedFile) { // Only set error if textarea is empty AND no file is selected
//       setError('Sequence cannot be empty if not uploading a file.');
//     } else {
//       setError('');
//     }
//   };

//   // Parser for FASTA format
//   const parseFasta = (fastaContent) => {
//     const sequences = [];
//     const lines = fastaContent.split(/\r?\n/);
//     let currentSequence = '';
//     let currentHeader = '';

//     for (const line of lines) {
//       const trimmedLine = line.trim();
//       if (trimmedLine.startsWith('>')) {
//         if (currentHeader) { // Save previous sequence
//           sequences.push({ header: currentHeader, sequence: currentSequence.replace(/\s/g, '') });
//         }
//         currentHeader = trimmedLine.substring(1);
//         currentSequence = '';
//       } else if (currentHeader && trimmedLine) { // Only add to sequence if a header has been found and line is not empty
//         currentSequence += trimmedLine;
//       }
//     }
//     if (currentHeader) { // Save the last sequence
//       sequences.push({ header: currentHeader, sequence: currentSequence.replace(/\s/g, '') });
//     }
//     return sequences.filter(s => s.sequence); // Ensure only sequences with content are returned
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.name.endsWith('.fasta') || file.name.endsWith('.fa') || file.type === 'text/plain') {
//         setSelectedFile(file);
//         setError(''); // Clear previous errors
//         setResults(null); // Clear single sequence results
//         setMultiResults([]); // Clear multi sequence results
//         setSequence(''); // Clear textarea if a file is selected
//       } else {
//         setSelectedFile(null);
//         setError('Please select a valid .fasta, .fa, or .txt file.');
//       }
//     } else {
//         setSelectedFile(null); // Clear file if selection is cancelled
//     }
//   };

//   const handleSubmitSingleSequence = async (e) => {
//     e.preventDefault();
    
//     if (sequence.trim() === '') {
//       setError('Please enter a protein sequence for single prediction.');
//       return;
//     }
    
//     setLoading(true);
//     setError(''); 
//     setResults(null); 
//     setMultiResults([]); // Clear multi-results if submitting single sequence

//     let sequenceToSubmit = sequence.trim();
//     // Check if the input sequence looks like a FASTA entry
//     // A simple check: starts with '>' and contains at least one newline
//     const lines = sequenceToSubmit.split(/\r?\n/);
//     if (lines.length > 0 && lines[0].startsWith('>')) {
//       // It's likely a FASTA entry, extract only the sequence part
//       sequenceToSubmit = lines.slice(1).join('').replace(/\s/g, ''); // Remove any spaces/newlines from sequence part
//     } else {
//       // Assume it's a raw sequence, just remove all spaces/newlines
//       sequenceToSubmit = sequenceToSubmit.replace(/\s/g, '');
//     }

//     if (sequenceToSubmit.trim() === '') {
//       setError('The processed sequence is empty. Please provide a valid protein sequence.');
//       setLoading(false);
//       return;
//     }
    
//     try {
//         const response = await fetch('http://localhost:8000/predict', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           protein_sequence: sequenceToSubmit, // Use the processed sequence
//         }),
//       });
  
//       if (!response.ok) {
//         let errorDetail = 'Error al realizar la predicción'; 
//         try {
//           const errorData = await response.json();
//           if (errorData && errorData.detail) {
//             errorDetail = errorData.detail; 
//           }
//         } catch {
//           errorDetail = `Error: ${response.status} ${response.statusText || 'Network response was not ok'}`;
//         }
//         throw new Error(errorDetail);
//       }
  
//       const data = await response.json();
//       console.log('Respuesta del Servidor (Single):', data);
//       setResults(data);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || 'Error processing your request. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFastaFileSubmit = async () => {
//     if (!selectedFile) {
//       setError('Please select a FASTA file first.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setResults(null); 
//     setMultiResults([]); 

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const fileContent = event.target.result;
//         const parsedSequences = parseFasta(fileContent);

//         if (parsedSequences.length === 0) {
//           setError('No valid sequences found in the FASTA file or invalid format.');
//           setLoading(false);
//           return;
//         }

//         const allPredictions = [];
//         for (const item of parsedSequences) {
//           if (item.sequence.trim() === '') {
//             const errorEntry = { header: item.header, error: 'Empty sequence in file', sequence: item.sequence };
//             allPredictions.push(errorEntry);
//             setMultiResults(prevResults => [...prevResults, errorEntry]);
//             continue;
//           }
//           try {
//             const response = await fetch('http://localhost:8000/predict', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ protein_sequence: item.sequence }),
//             });

//             let predictionData;
//             if (!response.ok) {
//               let errorDetail = `Error for ${item.header || 'sequence'}`;
//               try {
//                 const errorData = await response.json();
//                 if (errorData && errorData.detail) {
//                   errorDetail = `${item.header || 'Sequence'}: ${errorData.detail}`;
//                 }
//               } catch {
//                 errorDetail = `Error for ${item.header || 'sequence'}: ${response.status} ${response.statusText || 'Network response was not ok'}`;
//               }
//               predictionData = { header: item.header, error: errorDetail, sequence: item.sequence };
//             } else {
//               const data = await response.json();
//               predictionData = { header: item.header, ...data, sequence: item.sequence };
//             }
//             allPredictions.push(predictionData);
//             setMultiResults(prevResults => [...prevResults, predictionData]);

//           } catch (err) {
//             const errorEntry = { header: item.header, error: err.message || 'Prediction request failed', sequence: item.sequence };
//             allPredictions.push(errorEntry);
//             setMultiResults(prevResults => [...prevResults, errorEntry]);
//           }
//         }
//       } catch (fileReadError) {
//         setError('Error reading or parsing the FASTA file.');
//         console.error(fileReadError);
//       } finally {
//         setLoading(false);
//       }
//     };
//     reader.onerror = () => {
//       setError('Error reading the file.');
//       setLoading(false);
//     };
//     reader.readAsText(selectedFile);
//   };

//   return (
//     <Container fluid className="prediction-container">
//       <Row className="justify-content-center text-center mt-5">
//         <Col xs={12}>
//           <h1 className="banner" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
//             Protein Stability Prediction Tool
//           </h1>
//         </Col>
//       </Row>

//       <Row className="justify-content-center">
//         <Col xs={10} md={8} className="text-center mt-3">
//           <div className="info-box">
//             <h4>How does the Prediction Work?</h4>
//             <p>
//               Enter your protein sequence below, or upload a FASTA file for batch predictions. Our machine learning model will analyze it
//               to predict the melting temperature.
//             </p>
//           </div>
//         </Col>
//       </Row>

//       <Row className="justify-content-center mt-4">
//         <Col xs={10} md={8}>
//           <Form> {/* Removed onSubmit from Form tag, using onClick for buttons */}
//             <Form.Group className="mb-3">
//               <Form.Label>Enter Protein Sequence (for single prediction)</Form.Label>
//               <Form.Control 
//                 as="textarea" 
//                 rows={6} 
//                 value={sequence}
//                 onChange={handleSequenceChange}
//                 placeholder={selectedFile ? "FASTA file selected, textarea disabled for single input" : ">example_protein\nMKVLILACLVALALARELEELNVPGEIVESLSSS..."}
//                 className={error && !selectedFile ? 'is-invalid' : ''}
//                 style={{ fontFamily: 'monospace' }}
//                 disabled={!!selectedFile} // Disable textarea if a file is selected
//               />
//               {error && !selectedFile && <div className="text-danger mt-1">{error}</div>}
//               <Form.Text className="text-muted">
//                 Input a single protein sequence (FASTA or raw) or use the file upload below.
//               </Form.Text>
//             </Form.Group>

//             <div className="d-grid gap-2 mb-3">
//               <Button 
//                 variant="primary" 
//                 onClick={handleSubmitSingleSequence} 
//                 disabled={loading || !!selectedFile || sequence.trim() === ''}
//                 size="lg"
//               >
//                 {loading && !selectedFile ? 'Processing Single...' : 'Predict Stability (Single Sequence)'}
//               </Button>
//             </div>

//             <hr />

//             <Form.Group controlId="formFile" className="mb-3">
//               <Form.Label>Or Upload a FASTA File for Batch Prediction</Form.Label>
//               <Form.Control type="file" accept=".fasta,.fa,.txt" onChange={handleFileChange} />
//               {error && selectedFile && <div className="text-danger mt-1">{error}</div>}
//             </Form.Group>

//             <div className="d-grid gap-2">
//               <Button 
//                 variant="secondary" 
//                 onClick={handleFastaFileSubmit} 
//                 disabled={!selectedFile || loading}
//                 size="lg"
//               >
//                 {loading && selectedFile ? 'Processing File...' : 'Predict from File'}
//               </Button>
//             </div>
//           </Form>
//         </Col>
//       </Row>
      
//       {/* Single Result Section */}
//       {results && !loading && !multiResults.length && (
//         <Row className="justify-content-center mt-5">
//           <Col xs={10} md={8}>
//             <Card className="results-card">
//               <Card.Header as="h5" className="text-center bg-primary text-white">
//                 Prediction Result (Single Sequence)
//               </Card.Header>
//               <Card.Body>
//                 <Row className='justify-content-center'>
//                   <Col md={6} className="text-center mb-4">
//                     <h3>Predicted Melting Temperature</h3>
//                     <div className="temperature-display" style={{ 
//                       fontSize: '3rem', 
//                       fontWeight: 'bold',
//                       color: '#007bff',                      
//                     }}>
//                       {results.predicted_tm.toFixed(2)}°C
//                     </div>
//                   </Col>
//                 </Row>
//                 <hr />
//                 <div className="mt-4">
//                   <h5>What does this mean?</h5>
//                   <p>
//                     The predicted melting temperature of {results.predicted_tm.toFixed(2)}°C indicates 
//                     {parseFloat(results.predicted_tm) > 60 
//                       ? ' a relatively high thermal stability. This protein should maintain its structure and function at elevated temperatures.'
//                       : parseFloat(results.predicted_tm) > 45
//                         ? ' a moderate thermal stability. This protein should be stable at room temperature but may denature at elevated temperatures.'
//                         : ' a relatively low thermal stability. This protein may be sensitive to temperature changes and could denature easily.'
//                     }
//                   </p>
//                   <p><small>Model Info: {results.info}</small></p>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       {/* Multi-Results Section from FASTA File */}
//       {multiResults.length > 0 && !loading && (
//         <Row className="justify-content-center mt-5">
//           <Col xs={10} md={8}>
//             <Card className="results-card">
//               <Card.Header as="h5" className="text-center bg-success text-white">
//                 Batch Prediction Results
//               </Card.Header>
//               <Card.Body>
//                 {multiResults.map((res, index) => (
//                   <div key={index} className="mb-4 p-3 border rounded">
//                     <h6>Sequence ID: {res.header || `Entry ${index + 1}`}</h6>
//                     <p style={{fontSize: '0.8em', wordBreak: 'break-all', maxHeight: '60px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '5px', fontFamily: 'monospace'}}>
//                       {res.sequence ? `${res.sequence.substring(0,100)}${res.sequence.length > 100 ? '...' : ''}` : 'N/A'}
//                     </p>
//                     {res.error ? (
//                       <p className="text-danger"><strong>Error: {res.error}</strong></p>
//                     ) : (
//                       <>
//                         <p>Predicted Melting Temperature: <strong style={{fontSize: '1.2em', color: '#007bff'}}>{res.predicted_tm.toFixed(2)}°C</strong></p>
//                         <p>
//                           Interpretation: {parseFloat(res.predicted_tm) > 60 
//                             ? 'A relatively high thermal stability.'
//                             : parseFloat(res.predicted_tm) > 45
//                               ? 'A moderate thermal stability.'
//                               : 'A relatively low thermal stability.'
//                           }
//                         </p>
//                          <p><small>Model Info: {res.info}</small></p>
//                       </>
//                     )}
//                     {index < multiResults.length - 1 && <hr />}
//                   </div>
//                 ))}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       )}

//       <div style={{ marginBottom: '100px' }}></div>
//     </Container>
//   );
// };

// export default PredictionPage;

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
// import { Bar } from 'react-chartjs-2'; // Descomentar si usas el gráfico
// import OverlayTrigger from 'react-bootstrap/Tooltip'; // Descomentar si se usa
// import Tooltip from 'react-bootstrap/Tooltip'; // Descomentar si se usa
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  // Legend // Descomentar si usas leyenda en los gráficos
} from 'chart.js';

// Registrar componentes de ChartJS si usas gráficos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip /*, Legend */);

const PredictionPage = () => {
  const [sequence, setSequence] = useState('');
  const [results, setResults] = useState(null); // Para resultado de secuencia única
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Para archivo FASTA
  const [multiResults, setMultiResults] = useState([]); // Para resultados de archivo FASTA

  const handleSequenceChange = (e) => {
    setSequence(e.target.value);
    if (e.target.value.trim() === '' && !selectedFile) { // Solo mostrar error si el textarea está vacío Y no hay archivo seleccionado
      setError('La secuencia no puede estar vacía si no se carga un archivo.');
    } else {
      setError('');
    }
  };

  // Parser para formato FASTA
  const parseFasta = (fastaContent) => {
    const sequences = [];
    const lines = fastaContent.split(/\r?\n/);
    let currentSequence = '';
    let currentHeader = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('>')) {
        if (currentHeader || currentSequence) { 
          sequences.push({ header: currentHeader || 'Secuencia sin nombre', sequence: currentSequence.replace(/\s/g, '') });
        }
        currentHeader = trimmedLine.substring(1).trim();
        currentSequence = '';
      } else if (trimmedLine) { 
        currentSequence += trimmedLine;
      }
    }
    if (currentHeader || currentSequence) {
        if (currentSequence.replace(/\s/g, '')) { 
             sequences.push({ header: currentHeader || 'Secuencia sin nombre', sequence: currentSequence.replace(/\s/g, '') });
        }
    }
    return sequences.filter(s => s.sequence); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.fasta') || file.name.endsWith('.fa') || file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setSelectedFile(file);
        setError(''); 
        setResults(null); 
        setMultiResults([]); 
        setSequence(''); 
      } else {
        setSelectedFile(null);
        setError('Por favor, selecciona un archivo .fasta, .fa o .txt válido.');
      }
    } else {
        setSelectedFile(null); 
    }
  };

  const handleSubmitSingleSequence = async (e) => {
    e.preventDefault();
    
    if (sequence.trim() === '') {
      setError('Por favor, ingresa una secuencia de proteína para la predicción individual.');
      return;
    }
    
    setLoading(true);
    setError(''); 
    setResults(null); 
    setMultiResults([]); 

    let sequenceToSubmit = sequence.trim();
    const lines = sequenceToSubmit.split(/\r?\n/);
    if (lines.length > 0 && lines[0].startsWith('>')) {
      sequenceToSubmit = lines.slice(1).join('').replace(/\s/g, '');
    } else {
      sequenceToSubmit = sequenceToSubmit.replace(/\s/g, '');
    }

    if (sequenceToSubmit.trim() === '') {
      setError('La secuencia procesada está vacía. Por favor, proporciona una secuencia de proteína válida.');
      setLoading(false);
      return;
    }
    
    try {
        const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protein_sequence: sequenceToSubmit, 
        }),
      });
  
      if (!response.ok) {
        let errorDetail = 'Error al realizar la predicción'; 
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorDetail = errorData.detail; 
          }
        } catch {
          errorDetail = `Error: ${response.status} ${response.statusText || 'La respuesta de la red no fue ok'}`;
        }
        throw new Error(errorDetail);
      }
  
      const data = await response.json();
      console.log('Respuesta del Servidor (Individual):', data);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error procesando tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastaFileSubmit = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo FASTA primero.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null); 
    setMultiResults([]); 

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target.result;
        const parsedSequences = parseFasta(fileContent);

        if (parsedSequences.length === 0) {
          setError('No se encontraron secuencias válidas en el archivo FASTA o el formato es inválido.');
          setLoading(false);
          return;
        }

        for (const item of parsedSequences) {
          if (item.sequence.trim() === '') {
            const errorEntry = { header: item.header, error: 'Secuencia vacía en el archivo', sequence: item.sequence };
            setMultiResults(prevResults => [...prevResults, errorEntry]);
            continue;
          }
          try {
            const response = await fetch('http://localhost:8000/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ protein_sequence: item.sequence }),
            });

            let predictionData;
            if (!response.ok) {
              let errorDetail = `Error para ${item.header || 'secuencia'}`;
              try {
                const errorData = await response.json();
                if (errorData && errorData.detail) {
                  errorDetail = `${item.header || 'Secuencia'}: ${errorData.detail}`;
                }
              } catch {
                errorDetail = `Error para ${item.header || 'secuencia'}: ${response.status} ${response.statusText || 'La respuesta de la red no fue ok'}`;
              }
              predictionData = { header: item.header, error: errorDetail, sequence: item.sequence };
            } else {
              const data = await response.json();
              predictionData = { header: item.header, ...data, sequence: item.sequence };
            }
            setMultiResults(prevResults => [...prevResults, predictionData]);

          } catch (err) {
            const errorEntry = { header: item.header, error: err.message || 'Falló la solicitud de predicción', sequence: item.sequence };
            setMultiResults(prevResults => [...prevResults, errorEntry]);
          }
        }
      } catch (fileReadError) {
        setError('Error leyendo o parseando el archivo FASTA.');
        console.error(fileReadError);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error leyendo el archivo.');
      setLoading(false);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <Container fluid className="prediction-container">
      <Row className="justify-content-center text-center mt-5">
        <Col xs={12}>
          <h1 className="banner" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Herramienta de Predicción de Estabilidad de Proteínas
          </h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={10} md={8} className="text-center mt-3">
          <div className="info-box p-3 mb-3 bg-light border rounded">
            <h4>¿Cómo funciona la Predicción?</h4>
            <p>
              Ingresa tu secuencia de proteína abajo, o carga un archivo FASTA para predicciones por lotes. Nuestro modelo de aprendizaje automático la analizará
              para predecir la temperatura de desnaturalización.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={10} md={8}>
          <Form> 
            <Form.Group className="mb-3">
              <Form.Label>Ingresa Secuencia de Proteína (para predicción individual)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={6} 
                value={sequence}
                onChange={handleSequenceChange}
                placeholder={selectedFile ? "Archivo FASTA seleccionado, campo de texto deshabilitado" : ">proteina_ejemplo\nMKVLILACLVALALARELEELNVPGEIVESLSSS..."}
                className={error && !selectedFile ? 'is-invalid' : ''}
                style={{ fontFamily: 'monospace' }}
                disabled={!!selectedFile} 
              />
              {error && !selectedFile && <div className="text-danger mt-1">{error}</div>}
              <Form.Text className="text-muted">
                Ingresa una única secuencia de proteína (FASTA o cruda) o usa la carga de archivo de abajo.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
              <Button 
                variant="primary" 
                onClick={handleSubmitSingleSequence} 
                disabled={loading || !!selectedFile || sequence.trim() === ''}
                size="lg"
              >
                {loading && !selectedFile ? 'Procesando Individual...' : 'Predecir Estabilidad (Secuencia Individual)'}
              </Button>
            </div>

            <hr />

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>O Carga un Archivo FASTA para Predicción por Lotes</Form.Label>
              <Form.Control type="file" accept=".fasta,.fa,.txt" onChange={handleFileChange} />
              {error && selectedFile && <div className="text-danger mt-1">{error}</div>}
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                variant="secondary" 
                onClick={handleFastaFileSubmit} 
                disabled={!selectedFile || loading}
                size="lg"
              >
                {loading && selectedFile ? 'Procesando Archivo...' : 'Predecir desde Archivo'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      
      {/* Sección de Resultado Individual */}
      {results && !loading && !multiResults.length && (
        <Row className="justify-content-center mt-5">
          <Col xs={10} md={8}>
            <Card className="results-card">
              <Card.Header as="h5" className="text-center bg-primary text-white">
                Resultado de la Predicción (Secuencia Individual)
              </Card.Header>
              <Card.Body>
                <Row className='justify-content-center'>
                  <Col md={12} className="text-center mb-4"> 
                    <h3>Temperatura de Desnaturalización Predicha</h3>
                    <div className="temperature-display" style={{ 
                      fontSize: '3rem', 
                      fontWeight: 'bold',
                      color: '#007bff',                      
                    }}>
                      {results.predicted_tm.toFixed(2)}°C
                    </div>
                  </Col>
                </Row>
                <hr />
                <div className="mt-4">
                  <h5>¿Qué significa esto?</h5>
                  <p>
                    La temperatura de desnaturalización predicha de {results.predicted_tm.toFixed(2)}°C indica 
                    {parseFloat(results.predicted_tm) > 60 
                      ? ' una estabilidad térmica relativamente alta. Esta proteína debería mantener su estructura y función a temperaturas elevadas.'
                      : parseFloat(results.predicted_tm) > 45
                        ? ' una estabilidad térmica moderada. Esta proteína debería ser estable a temperatura ambiente pero podría desnaturalizarse a temperaturas elevadas.'
                        : ' una estabilidad térmica relativamente baja. Esta proteína podría ser sensible a cambios de temperatura y desnaturalizarse fácilmente.'
                    }
                  </p>
                  <p><small>Info del Modelo: {results.info}</small></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Sección de Resultados Múltiples de Archivo FASTA */}
      {multiResults.length > 0 && !loading && (
        <Row className="justify-content-center mt-5">
          <Col xs={10} md={8}>
            <Card className="results-card">
              <Card.Header as="h5" className="text-center bg-success text-white">
                Resultados de la Predicción por Lotes
              </Card.Header>
              <Card.Body>
                {multiResults.map((res, index) => (
                  <div key={index} className="mb-4 p-3 border rounded">
                    <h6>ID de Secuencia: {res.header || `Entrada ${index + 1}`}</h6>
                    <p style={{fontSize: '0.8em', wordBreak: 'break-all', maxHeight: '60px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '5px', fontFamily: 'monospace'}}>
                      {res.sequence ? `${res.sequence.substring(0,100)}${res.sequence.length > 100 ? '...' : ''}` : 'N/A'}
                    </p>
                    {res.error ? (
                      <p className="text-danger"><strong>Error: {res.error}</strong></p>
                    ) : (
                      <>
                        <p>Temperatura de Desnaturalización Predicha: <strong style={{fontSize: '1.2em', color: '#007bff'}}>{res.predicted_tm.toFixed(2)}°C</strong></p>
                        <p>
                          Interpretación: {parseFloat(res.predicted_tm) > 60 
                            ? 'Una estabilidad térmica relativamente alta.'
                            : parseFloat(res.predicted_tm) > 45
                              ? 'Una estabilidad térmica moderada.'
                              : 'Una estabilidad térmica relativamente baja.'
                          }
                        </p>
                         {res.info && <p><small>Info del Modelo: {res.info}</small></p>}
                      </>
                    )}
                    {index < multiResults.length - 1 && <hr />}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div style={{ marginBottom: '100px' }}></div> {/* Espaciador en la parte inferior */}
    </Container>
  );
};

export default PredictionPage;