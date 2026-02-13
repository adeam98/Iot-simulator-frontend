import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ 
          width: '80px', height: '80px', background: '#e0e7ff', color: '#4f46e5', 
          borderRadius: '50%', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          👨‍💻
        </div>
        <h1 style={{ marginBottom: '10px' }}>About the Project</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Developed for the Distributed Systems Course.
        </p>

        <div style={{ textAlign: 'left', marginTop: '3rem' }}>
          <h3>🎯 Project Goal</h3>
          <p style={{ color: '#475569', lineHeight: '1.7' }}>
            The goal of this project was to create a web-based simulator that parses, validates, and visualizes IoT sensor data without relying on backend databases. 
            By utilizing <strong>Client-Side XML Processing</strong>, we demonstrate how standard data interchange formats can be used to build robust applications.
          </p>

          <h3 style={{ marginTop: '2rem' }}>🎓 Student Info</h3>
          <ul style={{ color: '#475569', lineHeight: '1.8' }}>
            <li><strong>Name:</strong> [Your Name Here]</li>
            <li><strong>Subject:</strong> XML & Web Technologies</li>
            <li><strong>Year:</strong> 2024</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;