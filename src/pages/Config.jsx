import React, { useState } from 'react';

const Config = () => {
  const [formData, setFormData] = useState({
    deviceId: 'IOT-DEVICE-001',
    owner: 'Admin',
    protocol: 'MQTT', 
    frequency: '60',  
    sensors: []
  });

  const [newSensor, setNewSensor] = useState({ type: 'Temperature', unit: 'C', threshold: '30' });

  const addSensor = () => {
    setFormData({ ...formData, sensors: [...formData.sensors, newSensor] });
    setNewSensor({ type: 'Temperature', unit: 'C', threshold: '30' }); // Reset
  };

  const generateXML = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<DeviceConfig>
    <MetaData>
        <DeviceId>${formData.deviceId}</DeviceId>
        <Owner>${formData.owner}</Owner>
        <Protocol>${formData.protocol}</Protocol>
        <Frequency>${formData.frequency}</Frequency>
    </MetaData>
    <Sensors>
`;

    formData.sensors.forEach(s => {
      xml += `        <SensorConfig type="${s.type}">
            <Unit>${s.unit}</Unit>
            <Threshold>${s.threshold}</Threshold>
        </SensorConfig>
`;
    });

    xml += `    </Sensors>
</DeviceConfig>`;

    
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'device_config.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2>🛠️ XML Config Generator</h2>
          <p style={{ color: '#64748b' }}>Define your IoT device parameters and generate a valid XML file.</p>
        </div>

        {/* Global Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label>Device ID</label>
            <input type="text" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} />
          </div>
          <div>
            <label>Owner</label>
            <input type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} />
          </div>
          <div>
            <label>Protocol (Req)</label>
            <select 
              value={formData.protocol} 
              onChange={e => setFormData({...formData, protocol: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0' }}
            >
              <option value="HTTP">HTTP (REST)</option>
              <option value="MQTT">MQTT</option>
              <option value="CoAP">CoAP</option>
            </select>
          </div>
          <div>
            <label>Frequency (seconds)</label>
            <input type="number" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

        {/* Sensor Adder */}
        <h4>Add Sensors</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '20px' }}>
          <div>
            <label>Type</label>
            <input type="text" value={newSensor.type} onChange={e => setNewSensor({...newSensor, type: e.target.value})} placeholder="e.g. Temperature" />
          </div>
          <div>
            <label>Unit</label>
            <input type="text" value={newSensor.unit} onChange={e => setNewSensor({...newSensor, unit: e.target.value})} placeholder="e.g. C" />
          </div>
          <div>
            <label>Threshold</label>
            <input type="number" value={newSensor.threshold} onChange={e => setNewSensor({...newSensor, threshold: e.target.value})} />
          </div>
          <button onClick={addSensor} style={{ background: '#10b981', padding: '10px 15px' }}>
            + Add
          </button>
        </div>

        {/* List of Added Sensors */}
        {formData.sensors.length > 0 && (
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {formData.sensors.map((s, i) => (
                <li key={i} style={{ marginBottom: '5px' }}>
                  <strong>{s.type}</strong> ({s.unit}) - Alert if &gt; {s.threshold}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={generateXML} style={{ fontSize: '1.1rem' }}>
          ⬇️ Generate & Download XML
        </button>
      </div>
    </div>
  );
};

export default Config;