import React from 'react';

const Dashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💤</div>
        <h3 style={{ color: '#64748b' }}>System Offline</h3>
        <p style={{ color: '#94a3b8' }}>Upload configuration and sensor files to start the simulation.</p>
      </div>
    );
  }

  const { deviceId, sensors } = data;

  return (
    <div className="card">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>📡 Live Monitor</h2>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Device ID: <strong>{deviceId}</strong></span>
        </div>
        <div className="badge badge-success">
          <span style={{ marginRight: '6px' }}>●</span> Online
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sensor Type</th>
              <th>Real-time Value</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor, index) => (
              <tr key={index}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Dynamic Icon based on type */}
                  <span style={{ background: '#f3f4f6', padding: '8px', borderRadius: '8px' }}>
                    {sensor.type === 'Temperature' ? '🌡️' : sensor.type === 'Humidity' ? '💧' : '📊'}
                  </span>
                  {sensor.type}
                </td>
                <td style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>
                  {sensor.value}
                </td>
                <td style={{ color: '#64748b' }}>{sensor.unit}</td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {sensor.timestamp}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;