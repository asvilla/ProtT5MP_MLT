// src/App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import TechnicalDetailsPage from './components/TechnicalDetailsPage';
import PredictionPage from './components/PredictionPage';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <div style={{ paddingBottom: '70px' }}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/technical' element={<TechnicalDetailsPage />} />
            <Route path='/prediction' element={<PredictionPage />} />
          </Routes>
        </div>
      </BrowserRouter>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '20px', 
        backgroundColor: 'black',  // Changed from #f8f9fa to black
        color: 'white',           // Added white text color
        position: 'fixed',
        bottom: 0,
        left: 0, 
        width: '100%',
        borderTop: '1px solid #333',  // Darker border for better contrast
        zIndex: 1000
      }}>
        <p>ML Protein Analysis Project - &copy; 2025</p>
    </footer>
    </>
  );
}

export default App;