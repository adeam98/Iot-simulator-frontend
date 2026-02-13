import React, { useEffect, useState } from 'react';

const Alert = ({ message, type = 'error' }) => {
  const [visible, setVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  const isError = type === 'error';
  
  // Theme configuration
  const theme = isError 
    ? { color: '#ff4d4d', icon: '⚠️', glow: 'rgba(255, 77, 77, 0.4)' }
    : { color: '#00f2fe', icon: '✅', glow: 'rgba(0, 242, 254, 0.4)' };

  return (
    <div 
      className={`holo-alert ${visible ? 'visible' : ''}`}
      style={{
        '--alert-color': theme.color,
        '--alert-glow': theme.glow
      }}
    >
      {/* Moving Scanline Effect */}
      <div className="scanline"></div>

      {/* Icon Section */}
      <div className="alert-icon-box">
        {theme.icon}
      </div>

      {/* Content Section */}
      <div className="alert-content">
        <span className="alert-title">{isError ? 'System Error' : 'Success'}</span>
        <span className="alert-message">{message}</span>
      </div>

      {/* Decorative Corner */}
      <div className="corner-accent"></div>

      <style>{`
        .holo-alert {
          position: relative;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 20px;
          margin-bottom: 15px;
          background: rgba(10, 10, 20, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid var(--alert-color);
          border-radius: 4px 12px 12px 4px;
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          
          /* Animation Start State */
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .holo-alert.visible {
          opacity: 1;
          transform: translateX(0);
          box-shadow: 0 0 15px var(--alert-glow);
        }

        /* Hover Effect */
        .holo-alert:hover {
          background: rgba(20, 20, 35, 0.9);
          border-color: var(--alert-color);
        }

        /* Icon Styling */
        .alert-icon-box {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          box-shadow: inset 0 0 10px var(--alert-glow);
        }

        /* Text Styling */
        .alert-content {
          display: flex;
          flex-direction: column;
        }

        .alert-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--alert-color);
          font-weight: 700;
          margin-bottom: 2px;
        }

        .alert-message {
          font-size: 0.95rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        /* Scanline Animation */
        .scanline {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          animation: holo-scan 3s infinite;
          pointer-events: none;
        }

        /* Corner Tech Detail */
        .corner-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 15px 15px 0;
          border-color: transparent var(--alert-color) transparent transparent;
          opacity: 0.8;
        }

        @keyframes holo-scan {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default Alert;