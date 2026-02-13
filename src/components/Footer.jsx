import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      marginTop: '4rem', 
      padding: '2rem', 
      textAlign: 'center', 
      borderTop: '1px solid #e2e8f0',
      color: '#94a3b8',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <p style={{ marginBottom: '10px' }}>
          Built with ⚛️ React, XML, and ❤️ by <strong>Adam Traibi & Ilyas Bounouala</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.8rem' }}>
          <span>university of science rabat</span>
          <span>•</span>
          <span></span>
          <span>•</span>
          <span>2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;