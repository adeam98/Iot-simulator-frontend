import React, { useState, useEffect, useRef } from 'react';

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = 'rgba(79, 172, 254, 0.2)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();

        for (let j = i; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(79, 172, 254, ${0.1 * (1 - dist/100)})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', init); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.4, pointerEvents: 'none' }} />;
};

// --- 2. SPOTLIGHT DOC CARD ---
const DocCard = ({ icon, title, content }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  return (
    <div 
      ref={divRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
    >
      <div className="spotlight-glow" style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)` }} />
      <div className="spotlight-border" style={{ opacity, background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.5), transparent 40%)` }} />
      
      <div className="card-content">
        <div className="card-header">
          <span className="card-icon">{icon}</span>
          <h3>{title}</h3>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---
const Documentation = () => {
  return (
    <div className="page-wrapper">
      <NetworkBackground />
      <div className="vignette-overlay" />

      <div className="container">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">📚 Technical <span className="highlight">Documentation</span></h1>
          <p className="subtitle">
           Comprendre l’architecture pilotée par XML derrière le simulateur IoT.
          </p>
        </div>

        {/* Section 1: Architecture Pipeline */}
        <section className="section-block">
          <h2 className="section-title">🏗️ Architecture du système</h2>
          <div className="glass-panel pipeline-container">
            <p className="pipeline-desc">
             L’application suit une architecture strictement découplée où les données (XML), 
             les règles (Configuration) et la logique (JavaScript) sont des entités distinctes.
            </p>
            
            <div className="pipeline-flow">
              <TechBadge icon="📄" title="XML Files" desc="Data Input" />
              <div className="pipeline-arrow">➔</div>
              <TechBadge icon="🛡️" title="XSD Schema" desc="Validation" />
              <div className="pipeline-arrow">➔</div>
              <TechBadge icon="🧠" title="XPath" desc="Analysis Engine" />
              <div className="pipeline-arrow">➔</div>
              <TechBadge icon="🎨" title="XSLT" desc="Transformation" />
            </div>
          </div>
        </section>

        {/* Section 2: Cards Grid */}
        <section className="section-block">
          <h2 className="section-title">🛠️ Technologies principales</h2>
          <div className="grid-layout">
            <DocCard 
              title="XSD Validation" 
              icon="🛡️"
              content="Nous utilisons des schémas XSD stricts pour valider la structure de chaque fichier téléchargé. Cela évite le phénomène « Garbage In, Garbage Out » et garantit la sécurité des types pour les mesures des capteurs."
            />
            <DocCard 
              title="Requêtes XPath" 
              icon="🔍"
              content="Au lieu de boucles manuelles, nous utilisons des expressions XPath comme //SensorConfig[@type='Temperature'] pour interroger efficacement les seuils de configuration en temps O(1).."
            />
            <DocCard 
              title="XSLT Transformation" 
              icon="⚡"
              content="Les rapports HTML ne sont pas générés par React, mais par une feuille de style XSLT. Cela démontre la capacité à transformer des formats de données en utilisant des outils XML standard."
              />
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

        :root {
          --primary: #4FACFE;
          --secondary: #00F2FE;
          --bg-dark: #090912;
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        body { margin: 0; background: var(--bg-dark); font-family: 'Space Grotesk', sans-serif; color: white; overflow-x: hidden; }

        .page-wrapper { min-height: 100vh; position: relative; background: radial-gradient(circle at 50% 0%, #1a1a2e 0%, #090912 100%); padding-bottom: 4rem; }
        .vignette-overlay { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 50% 50%, transparent 0%, #000 120%); z-index: 1; }

        .container { position: relative; z-index: 5; max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }

        /* HEADER */
        .header-section { text-align: center; margin-bottom: 4rem; }
        .main-title { font-size: 3.5rem; margin-bottom: 1rem; background: linear-gradient(to bottom, #fff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .highlight { color: var(--secondary); -webkit-text-fill-color: var(--secondary); text-shadow: 0 0 20px rgba(0, 242, 254, 0.4); }
        .subtitle { font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto; line-height: 1.6; }

        /* SECTIONS */
        .section-block { margin-bottom: 4rem; }
        .section-title { font-size: 1.8rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; display: inline-block; width: 100%; color: #e2e8f0; }

        /* PIPELINE (Architecture) */
        .glass-panel {
          background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border);
          border-radius: 16px; padding: 2rem;
        }
        .pipeline-desc { color: #cbd5e1; margin-bottom: 2rem; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto; }
        
        .pipeline-flow { display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .pipeline-arrow { font-size: 1.5rem; color: var(--primary); opacity: 0.6; animation: pulse 2s infinite; }
        
        .tech-badge { text-align: center; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s; min-width: 120px; }
        .tech-badge:hover { transform: translateY(-5px); background: rgba(255,255,255,0.08); border-color: var(--secondary); box-shadow: 0 0 15px rgba(0, 242, 254, 0.2); }
        .badge-icon { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
        .badge-title { font-weight: 700; font-size: 0.9rem; color: white; display: block; margin-bottom: 4px; }
        .badge-desc { font-size: 0.75rem; color: #94a3b8; display: block; text-transform: uppercase; letter-spacing: 1px; }

        /* CARDS GRID */
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }

        /* SPOTLIGHT CARD */
        .spotlight-card {
          position: relative; padding: 2rem; background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border); overflow: hidden;
        }
        .spotlight-glow { position: absolute; inset: 0; pointer-events: none; z-index: 1; transition: opacity 0.3s ease; }
        .spotlight-border {
          position: absolute; inset: 0; pointer-events: none; z-index: 2; transition: opacity 0.3s ease;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 1px; border-radius: inherit;
        }
        .card-content { position: relative; z-index: 3; }
        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .card-icon { font-size: 1.8rem; filter: drop-shadow(0 0 10px rgba(79,172,254,0.3)); }
        .spotlight-card h3 { margin: 0; font-size: 1.25rem; font-weight: 600; color: white; }
        .spotlight-card p { color: #94a3b8; line-height: 1.6; margin: 0; font-size: 0.95rem; }

        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: translateX(0); } 50% { opacity: 1; transform: translateX(3px); } }

        @media (max-width: 768px) {
          .pipeline-flow { flex-direction: column; }
          .pipeline-arrow { transform: rotate(90deg); margin: 0.5rem 0; }
          .main-title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

const TechBadge = ({ icon, title, desc }) => (
  <div className="tech-badge">
    <span className="badge-icon">{icon}</span>
    <span className="badge-title">{title}</span>
    <span className="badge-desc">{desc}</span>
  </div>
);

export default Documentation;