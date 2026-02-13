import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Documentation from './pages/Documentation';

// Styles
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/docs" element={<Documentation />} />
            {/* Fallback for unknown routes */}
            <Route path="*" element={<div className="container"><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;