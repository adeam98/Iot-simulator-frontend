import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="glass-nav">
        <div className="nav-container">
          
          {/* Brand Logo */}
          <Link to="/" className="brand">
            <div className="logo-icon">
              <span>📡</span>
            </div>
            <div className="logo-text">
              IoT<span className="highlight">Simulator</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/simulator" 
              className={`nav-item ${isActive('/simulator') ? 'active' : ''}`}
            >
              Simulator
            </Link>
            <Link 
              to="/docs" 
              className={`nav-item ${isActive('/docs') ? 'active' : ''}`}
            >
              Docs
            </Link>
          </div>
        </div>
      </nav>

      <style>{`
        /* --- Navbar Container --- */
        .glass-nav {
          background: rgba(20, 20, 25, 0.7); /* Dark semi-transparent */
          backdrop-filter: blur(20px); /* Heavy blur */
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0 20px;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        /* --- Brand / Logo --- */
        .brand {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: opacity 0.2s;
        }
        .brand:hover {
          opacity: 0.8;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0a84ff, #bf5af2); /* Matches Home Blobs */
          display: grid;
          place-items: center;
          font-size: 1.2rem;
          box-shadow: 0 0 15px rgba(10, 132, 255, 0.3);
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }
        
        .highlight {
          color: #bf5af2; /* Purple accent */
        }

        /* --- Links --- */
        .nav-links {
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.2);
          padding: 4px;
          border-radius: 99px; /* Pill shape container */
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-item {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          font-size: 0.9rem;
          padding: 8px 20px;
          border-radius: 99px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .nav-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Active State */
        .nav-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 600px) {
          .logo-text { display: none; } /* Hide text on small mobile */
          .nav-item { padding: 8px 14px; font-size: 0.85rem; }
        }
      `}</style>
    </>
  );
};

export default Navbar;