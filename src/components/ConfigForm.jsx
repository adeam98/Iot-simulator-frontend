import React, { useState } from 'react';

const ConfigForm = ({ onGenerate }) => {
  const [deviceId, setDeviceId] = useState("IoT-001");
  const [threshold, setThreshold] = useState("30");

  const handleGenerate = () => {
 
    const xmlString = `
<DeviceConfig>
  <DeviceId>${deviceId}</DeviceId>
  <Threshold>${threshold}</Threshold>
</DeviceConfig>`;
    
    onGenerate(xmlString);
  };

  return (
    <div className="card">
      <h3>⚙️ Manual Configuration</h3>
      <div className="form-group">
        <label>Device ID:</label>
        <input 
          type="text" 
          value={deviceId} 
          onChange={(e) => setDeviceId(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Temperature Threshold (°C):</label>
        <input 
          type="number" 
          value={threshold} 
          onChange={(e) => setThreshold(e.target.value)} 
        />
      </div>
      <button onClick={handleGenerate}>Generate Config XML</button>
    </div>
  );
};

export default ConfigForm;