import React from 'react';

const Chart = ({ data }) => {
  if (!data || !data.sensors) return null;

  
  const maxValue = Math.max(...data.sensors.map(s => s.value), 100);

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>📈 Sensor Trends</h3>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Live Visualization</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'flex-end', 
        height: '200px', 
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px' 
      }}>
        {data.sensors.map((sensor, index) => {
        
          const heightPercent = Math.min((sensor.value / maxValue) * 100, 100);
          
       
       
          const isHigh = sensor.value > 50; 
          const barColor = isHigh ? 'var(--warning)' : 'var(--primary)';
          
          return (
            <div key={index} style={{ textAlign: 'center', width: '60px' }}>
              
              {/* The Value Bubble */}
              <div style={{ 
                marginBottom: '10px', 
                fontWeight: 'bold', 
                fontSize: '0.9rem',
                color: '#475569',
                opacity: 0,
                animation: 'fadeIn 0.5s ease-out forwards 0.5s'
              }}>
                {sensor.value}
              </div>

              {/* The Bar */}
              <div style={{
                height: `${heightPercent}%`,
                width: '100%',
                background: `linear-gradient(to top, ${barColor}, rgba(255,255,255,0.5))`,
                borderRadius: '8px 8px 0 0',
                transition: 'height 1s ease-out',
                position: 'relative',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
              </div>

              {/* The Label */}
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                {sensor.type}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;