import React, { useEffect, useState, useRef } from 'react';

const ToastContainer = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    if (!alerts?.length) return;

    const newToasts = alerts.map(msg => ({
      id: Date.now() + Math.random(),
      msg
    }));

    setVisibleAlerts(prev => [...prev, ...newToasts]);
  }, [alerts]);

  const removeToast = (id) => {
    setVisibleAlerts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="toast-container">
      {visibleAlerts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.msg}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ message, onDismiss }) => {
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;

    timerRef.current = setTimeout(() => handleClose(), 10000);
    return () => clearTimeout(timerRef.current);
  }, [paused]);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`toast ${leaving ? 'toast-exit' : ''}`}
      onMouseEnter={() => {
        setPaused(true);
        clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="toast-content">
        <span className="toast-icon">🚨</span>
        <span className="toast-text">{message}</span>
      </div>

      <button className="toast-close" onClick={handleClose}>×</button>

      {!paused && <div className="toast-progress" />}
    </div>
  );
};

export default ToastContainer;

/* ================= STYLES ================= */
const styles = document.createElement('style');
styles.innerHTML = `
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  position: relative;
  overflow: hidden;
  min-width: 320px;
  padding: 16px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff5f5, #ffe4e6);
  color: #991b1b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  animation: slideIn 0.4s cubic-bezier(.16,1,.3,1);
}

.toast-exit {
  animation: slideOut 0.3s ease forwards;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 1.4rem;
}

.toast-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #991b1b;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s;
}

.toast-close:hover {
  transform: scale(1.2);
  opacity: 0.7;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #ef4444;
  animation: progress 10s linear forwards;
}

@keyframes slideIn {
  from { transform: translateX(60px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(60px); opacity: 0; }
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
`;
document.head.appendChild(styles);
