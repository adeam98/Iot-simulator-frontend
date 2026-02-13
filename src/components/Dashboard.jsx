import React, { useEffect, useRef, useState } from "react";

// Enhanced UniversalMonitor with stunning visuals and animations
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + (hash << 5) - hash;
  const c = (hash & 0x00ffffff).toString(16).padStart(6, "0");
  return `#${c}`;
};
const getIcon = (type) => {
  const icons = ["⚡", "💧", "🔥", "☢️", "🔊", "🔋", "🌪️", "🧊", "🛰️", "📡"];
  return icons[type?.length % icons.length] || "•";
};
const polar = (cx, cy, r, angleDeg) => {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

function useSpring(target, { stiffness = 0.12, damping = 0.85, precision = 0.0005 } = {}) {
  const [value, setValue] = useState(Number(target) || 0);
  const velRef = useRef(0);
  const targetRef = useRef(Number(target) || 0);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    targetRef.current = Number(target) || 0;
    if (rafRef.current) return;

    let canceled = false;
    function tick(ts) {
      if (canceled) return;
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(50, ts - lastRef.current) / 16.67;
      lastRef.current = ts;

      const curr = value;
      const tgt = targetRef.current;
      const force = (tgt - curr) * stiffness;
      velRef.current = (velRef.current + force * dt) * Math.pow(damping, dt);
      const next = curr + velRef.current * dt * 16.67 / 1000 * 60;

      if (Math.abs(tgt - next) < precision && Math.abs(velRef.current) < precision) {
        setValue(tgt);
        velRef.current = 0;
        canceled = true;
        rafRef.current = null;
        lastRef.current = null;
        return;
      }

      setValue(next);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      canceled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [target]);

  return value;
}

const SensorCard = ({ sensor, playbackMultiplier = 1 }) => {
  const { id, type, value: incoming, threshold = 1, unit = "" } = sensor;
  const color = stringToColor(type || id || "sensor");
  const safeCap = threshold * 1.2 || 1;
  const [isHovered, setIsHovered] = useState(false);

  const animated = useSpring(incoming, { stiffness: 0.14, damping: 0.82, precision: 0.001 });
  const percent = clamp(animated / safeCap, 0, 1);
  const display = Math.round(animated * 100) / 100;

  const MAX = 48;
  const [history, setHistory] = useState(() => new Array(MAX).fill(Number(incoming) || 0));
  useEffect(() => {
    setHistory((h) => {
      const copy = h.slice();
      copy.push(Number(incoming) || 0);
      if (copy.length > MAX) copy.shift();
      return copy;
    });
  }, [incoming, playbackMultiplier]);

  const minH = Math.round(Math.min(...history, 0) * 100) / 100;
  const maxH = Math.round(Math.max(...history) * 100) / 100;
  const avg = Math.round((history.reduce((a, b) => a + b, 0) / history.length) * 100) / 100;

  const W = 140, H = 44;
  const minVal = Math.min(...history, 0);
  const maxVal = Math.max(...history, safeCap);
  const range = Math.max(0.0001, maxVal - minVal);
  const points = history.map((v, i) => `${(i / (history.length - 1 || 1)) * W},${H - ((v - minVal) / range) * H}`).join(" ");

  const thresholdPercent = clamp(threshold / safeCap, 0, 1);
  const peak = Math.max(...history);
  const danger = incoming > threshold;

  return (
    <div 
      className={`sensor-card upgraded ${danger ? "danger" : ""}`} 
      style={{ 
        '--accent': color,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? `0 30px 70px rgba(0,0,0,0.15), 0 0 40px ${color}33`
          : '0 10px 40px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }} />
      
      <div className="card-top">
        <div className="title">
          <div className="icon" style={{ 
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            boxShadow: `0 4px 12px ${color}30`,
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
          }}>
            {getIcon(type)}
          </div>
          <div className="meta">
            <div className="name">{type || id}</div>
            <div className="sub">Live metric — <span className="muted">{unit}</span></div>
          </div>
        </div>
        <div className="actions">
          {danger && (
            <div className="warn" title="Above threshold" style={{
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>⚠️</div>
          )}
        </div>
      </div>

      <div className="gauge-row">
        <svg width={160} height={160} viewBox="0 0 160 160" className="gauge-svg">
          <defs>
            <linearGradient id={`g-${id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
            <filter id={`glow-${id}`}>
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id={`f-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={color} floodOpacity="0.3" />
            </filter>
          </defs>

          <g transform="translate(80,80)">
            <circle r="58" fill="url(#g-back)" opacity="0.05" />
            <circle r="52" fill="#fff" opacity="0.95" />
            
            <g transform={`rotate(-90)`}>
              <circle r="62" stroke="#f1f5f9" strokeWidth="14" fill="none" />
              <circle 
                r="62" 
                stroke={`url(#g-${id})`} 
                strokeWidth="14" 
                strokeLinecap="round" 
                fill="none"
                strokeDasharray={`${2 * Math.PI * 62 * percent} ${2 * Math.PI * 62 * (1 - percent)}`} 
                style={{ transition: 'stroke-dasharray 520ms cubic-bezier(.2,.85,.2,1)' }} 
                filter={`url(#f-${id})`} 
              />
            </g>

            <text x="0" y="-8" textAnchor="middle" fontSize="28" fontWeight="900" fill="#0f172a" style={{ filter: `drop-shadow(0 2px 4px ${color}40)` }}>
              {display}
            </text>
            <text x="0" y="20" textAnchor="middle" fontSize="13" fontWeight="600" fill="#64748b">{unit}</text>

            <g transform={`rotate(${(percent * 360).toFixed(2) - 90})`} style={{ transition: 'transform 520ms cubic-bezier(.2,.85,.2,1)' }}>
              <rect x="-3" y="-52" width="6" height="46" rx="3" fill={color} opacity="0.95" filter={`url(#glow-${id})`} />
              <circle r="7" fill={color} filter={`url(#glow-${id})`} />
            </g>

            {(() => {
              const mk = polar(0, 0, 62, thresholdPercent * 360);
              return <circle cx={mk.x} cy={mk.y} r="5" fill={danger ? '#ef4444' : '#94a3b8'} opacity="0.95" />;
            })()}
          </g>
        </svg>

        <div className="right-col">
          <div className="mini" style={{
            background: `linear-gradient(135deg, ${color}08, ${color}03)`,
            border: `1px solid ${color}20`
          }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <linearGradient id={`area-${id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopOpacity="0.3" stopColor={color} />
                  <stop offset="100%" stopOpacity="0.05" stopColor={color} />
                </linearGradient>
                <filter id={`line-glow-${id}`}>
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <polyline 
                fill="none" 
                stroke={color} 
                strokeWidth={2.5} 
                strokeLinejoin="round" 
                strokeLinecap="round" 
                points={points} 
                style={{ transition: 'all 220ms linear' }}
                filter={`url(#line-glow-${id})`}
              />
              <polyline points={points} fill={`url(#area-${id})`} stroke="none" />
              <line x1="0" y1={H} x2={W} y2={H} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={thresholdPercent * W} x2={thresholdPercent * W} y1={0} y2={H} stroke={danger ? '#ef4444' : '#94a3b8'} strokeDasharray="3 3" strokeWidth={1.5} opacity={0.8} />
            </svg>
          </div>

          <div className="labels">
            <div className="lbl">
              <div className="small">Limit</div>
              <div className="val">{threshold} {unit}</div>
            </div>
            <div className="lbl">
              <div className="small">Now</div>
              <div className="val highlight" style={{ color, textShadow: `0 0 10px ${color}40` }}>{display} {unit}</div>
            </div>
            <div className="lbl">
              <div className="small">Peak</div>
              <div className="val">{Math.round(peak * 100) / 100}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="expand-panel">
        <div className="stat-grid">
          <div className="stat" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
            <div className="s-title">Min</div>
            <div className="s-val">{minH}</div>
          </div>
          <div className="stat" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
            <div className="s-title">Avg</div>
            <div className="s-val">{avg}</div>
          </div>
          <div className="stat" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
            <div className="s-title">Max</div>
            <div className="s-val">{maxH}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ data = null, websocketUrl = null }) {
  const [state, setState] = useState(data);
  const [paused, setPaused] = useState(false);
  const [playbackMultiplier, setPlaybackMultiplier] = useState(1);
  const wsRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const onVis = () => (visibleRef.current = !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!state) return;
    if (websocketUrl) {
      try {
        wsRef.current = new WebSocket(websocketUrl);
        wsRef.current.onmessage = (ev) => {
          if (paused) return;
          try {
            const incoming = JSON.parse(ev.data);
            setState((s) => {
              const merged = { ...s };
              if (incoming.deviceId) merged.deviceId = incoming.deviceId;
              if (incoming.sensors) {
                merged.sensors = merged.sensors.map((prev) => {
                  const upd = incoming.sensors.find((x) => x.id === prev.id) || {};
                  return { ...prev, ...upd };
                });
              }
              return merged;
            });
          } catch (e) {
            console.warn("Invalid WS payload", e);
          }
        };
      } catch (e) {
        console.warn("WebSocket failed", e);
      }

      return () => {
        if (wsRef.current) wsRef.current.close();
        wsRef.current = null;
      };
    }

    let t = 0;
    let raf = null;
    function sim(ts) {
      if (!visibleRef.current) {
        raf = requestAnimationFrame(sim);
        return;
      }
      t += 1 * playbackMultiplier;
      setState((s) => {
        if (paused) return s;
        const out = { ...s, sensors: s.sensors.map((sen) => {
          const base = (sen.base != null) ? sen.base : (sen.value || 0);
          const noise = Math.sin((t + (sen.id?.length || 0)) * 0.07) * (base * 0.03 + 0.02);
          const drift = (Math.random() - 0.5) * (base * 0.015);
          const next = clamp(base + noise + drift, 0, Math.max(sen.threshold * 2, base * 2 + 0.1));
          return { ...sen, value: Math.round(next * 100) / 100, base };
        }) };
        return out;
      });
      raf = requestAnimationFrame(sim);
    }
    raf = requestAnimationFrame(sim);
    return () => cancelAnimationFrame(raf);
  }, [state?.deviceId, websocketUrl, paused, playbackMultiplier]);

  useEffect(() => {
    if (!data) return;
    setState((d) => {
      if (!d) return { ...data };
      return {
        ...data,
        sensors: data.sensors.map((s, i) => ({ id: s.id || `${data.deviceId}-${i}`, unit: s.unit || "", threshold: s.threshold || 1, value: s.value || 0, ...s }))
      };
    });
  }, [data]);

  if (!state) {
    // Default demo data
    setState({
      deviceId: "IOT-DEMO-001",
      protocol: "MQTT",
      frequency: 2,
      sensors: [
        { id: "temp-1", type: "Temperature", value: 72, threshold: 80, unit: "°F" },
        { id: "humid-1", type: "Humidity", value: 45, threshold: 60, unit: "%" },
        { id: "pressure-1", type: "Pressure", value: 1013, threshold: 1100, unit: "hPa" },
        { id: "voltage-1", type: "Voltage", value: 3.7, threshold: 5, unit: "V" }
      ]
    });
    return null;
  }

  const { deviceId, protocol, frequency } = state;

  const downloadJSON = () => {
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensor_data_${deviceId || 'device'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const downloadCSV = () => {
    const lines = [ ['id','type','value','threshold','unit'].join(',') ];
    state.sensors.forEach(s => lines.push([s.id, s.type, s.value, s.threshold, s.unit].join(',')));
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; 
    link.download = `sensor_data_${deviceId || 'device'}.csv`; 
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dash-wrap upgraded">
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="dash-header">
        <div>
          <h2 className="title">🎛️ Universal Monitor — Reactive</h2>
          <div className="subtitle">
            Device: <strong>{deviceId}</strong> 
            {protocol && <span className="muted"> • {protocol}</span>} 
            {frequency && <span className="muted"> • {frequency}s</span>}
          </div>
        </div>
        <div className="hdr-actions">
          <div className="controls">
            <button className="btn" onClick={() => setPaused((p) => !p)}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <select className="speed" value={playbackMultiplier} onChange={(e) => setPlaybackMultiplier(Number(e.target.value))}>
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
            <button className="btn-json" onClick={downloadJSON}>💾 JSON</button>
            <button className="btn-csv" onClick={downloadCSV}>📥 CSV</button>
          </div>
          <div className="live-dot">● Live</div>
        </div>
      </div>

      <div className="grid">
        {state.sensors.map((s, i) => (
          <SensorCard key={s.id || i} sensor={{ ...s, value: s.value }} playbackMultiplier={playbackMultiplier} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        
        :root { 
          --card-bg: rgba(255,255,255,0.9); 
          --muted: #64748b;
        }
        
        .dash-wrap.upgraded {
          margin: 0;
          padding: 24px;
          font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
          position: relative;
          overflow: hidden;
        }
        
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }
        
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }
        
        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #6366f1, transparent);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }
        
        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #8b5cf6, transparent);
          bottom: -150px;
          right: -150px;
          animation-delay: 7s;
        }
        
        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #06b6d4, transparent);
          top: 50%;
          left: 50%;
          animation-delay: 14s;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 20px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          margin-top: 4px;
        }
        
        .subtitle strong {
          color: white;
          font-weight: 700;
        }
        
        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .btn, .btn-json, .btn-csv, .speed {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 14px;
          color: #1e293b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .btn:hover, .btn-json:hover, .btn-csv:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          background: white;
        }
        
        .btn:active, .btn-json:active, .btn-csv:active {
          transform: translateY(0);
        }
        
        .speed {
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .live-dot {
          color: #10b981;
          font-weight: 800;
          font-size: 14px;
          animation: dotPulse 1.6s infinite;
          text-shadow: 0 0 10px #10b98180;
        }
        
        @keyframes dotPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
          position: relative;
          z-index: 1;
        }
        
        .sensor-card.upgraded {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        
        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 120px;
          pointer-events: none;
          opacity: 0.6;
          transition: opacity 0.4s ease;
        }
        
        .sensor-card.upgraded:hover .card-glow {
          opacity: 1;
        }
        
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        
        .title .name {
          font-weight: 900;
          color: #0f172a;
          font-size: 1.1rem;
        }
        
        .title .sub {
          font-size: 13px;
          color: var(--muted);
          margin-top: 2px;
        }
        
        .title {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        
        .icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .gauge-row {
          display: flex;
          gap: 16px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .gauge-svg {
          flex: 0 0 160px;
        }
        
        .right-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }
        
        .mini {
          padding: 10px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .labels {
          display: flex;
          gap: 12px;
        }
        
        .lbl {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .small {
          font-size: 11px;
          color: var(--muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .val {
          font-weight: 800;
          color: #0f172a;
          font-size: 15px;
        }
        
        .val.highlight {
          font-weight: 900;
          font-size: 16px;
        }
        
        .stat-grid {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 14px;
          position: relative;
          z-index: 1;
        }
        
        .stat {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .stat:hover {
          transform: translateY(-2px);
        }
        
        .s-title {
          font-size: 11px;
          color: var(--muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .s-val {
          font-weight: 900;
          font-size: 18px;
          color: #0f172a;
          margin-top: 4px;
        }
        
        .warn {
          font-size: 1.4rem;
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @media (max-width: 520px) {
          .gauge-row {
            flex-direction: column;
            align-items: center;
          }
          
          .dash-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .hdr-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          
          .controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}