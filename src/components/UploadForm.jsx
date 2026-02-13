import React, { useState } from 'react';

const UploadForm = ({ onUpload }) => {
  const [configContent, setConfigContent] = useState("");
  const [sensorContent, setSensorContent] = useState("");

  const handleFileRead = (e, setContent) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(configContent, sensorContent);
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>📁 Upload Data</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Load your XML configuration and sensor readings to start the simulation.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Device Config Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
            ⚙️ Device Configuration (XML)
          </label>
          <input 
            type="file" 
            accept=".xml" 
            onChange={(e) => handleFileRead(e, setConfigContent)}
            style={{
              padding: '10px',
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              background: '#f8fafc',
              width: '100%',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Sensor Data Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
            📊 Sensor Data (XML)
          </label>
          <input 
            type="file" 
            accept=".xml" 
            onChange={(e) => handleFileRead(e, setSensorContent)}
            style={{
              padding: '10px',
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              background: '#f8fafc',
              width: '100%',
              cursor: 'pointer'
            }}
          />
        </div>

        <button type="submit" style={{ width: '100%', fontSize: '1rem' }}>
          🚀 Launch Simulation
        </button>
      </form>

      {/* Download Samples Section */}
      <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
          Quick Start (Samples)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <a href="/samples/device_config.xml" download style={{ textDecoration: 'none' }}>
            <button style={{ background: '#e2e8f0', color: '#475569', boxShadow: 'none' }}>
              📄 Config
            </button>
          </a>
          <a href="/samples/sensor_data.xml" download style={{ textDecoration: 'none' }}>
            <button style={{ background: '#e2e8f0', color: '#475569', boxShadow: 'none' }}>
              📄 Sensor
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;