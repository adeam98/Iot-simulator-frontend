import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- 1. CANVAS BACKGROUND COMPONENT (The Neural Network) ---
const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseDistance = 200;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Particles
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse Repulsion
        if (mouse.x != null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            p.vx += forceDirectionX * force * 0.5;
            p.vy += forceDirectionY * force * 0.5;
          }
        }

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
        ctx.fill();

        // Connect Lines
        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.6 }} 
    />
  );
};

// --- 2. SPOTLIGHT CARD COMPONENT ---
const SpotlightCard = ({ icon, title, desc }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => setOpacity(0);

  return (
    <div 
      ref={divRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The Glow Effect */}
      <div 
        className="spotlight-glow"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 40%)`
        }}
      />
      {/* Border Glow */}
      <div 
        className="spotlight-border"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.6), transparent 40%)`
        }}
      />
      
      <div className="card-content">
        <div className="icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
const Home = () => {
  return (
    <div className="page-wrapper">
      <NetworkBackground />
      
      {/* Deep Space Overlay */}
      <div className="vignette-overlay" />

      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="icon-3d-container">
            <div className="icon-3d">📡</div>
            <div className="icon-ring"></div>
            <div className="icon-ring ring-2"></div>
          </div>
          
          <h1 className="main-title">
            Next-Gen <span className="glitch" data-text="IoT">IoT</span> Simulator
          </h1>
          
          <p className="subtitle">
           Validez les configurations, visualisez les données et simulez des réseaux de capteurs grâce à la puissance de <span className="highlight">XML</span> technologies.
          </p>
          
          <div className="cta-group">
            <Link to="/simulator" className="btn btn-primary">
              <span className="btn-content">Start Simulation </span>
              <div className="btn-shine"></div>
            </Link>
            
            <Link to="/docs" className="btn btn-glass">
              Read Docs 
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <SpotlightCard 
            icon="⚡"   
            title="Analyse en temps réel" 
            desc="Retour instantané sur les mesures des capteurs avec une visualisation à latence inférieure à la milliseconde." 
          />
          <SpotlightCard 
            icon="🛡️" 
            title="Validation XSD"
            desc="Une application stricte du schéma garantit que l’intégrité de vos données ne fait jamais défaut." 
          />
          <SpotlightCard 
            icon="🔄" 
            title="Transformation XSLT" 
            desc="Convertissez facilement des flux XML bruts en magnifiques rapports HTML." 
          />
        </div>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap');

        :root {
          --primary: #4FACFE;
          --secondary: #00F2FE;
          --bg-dark: #090912;
          --text-color: #ffffff;
        }

        body, html { margin: 0; padding: 0; background: var(--bg-dark); font-family: 'Space Grotesk', sans-serif; color: white; overflow-x: hidden; }
        
        .page-wrapper {
          position: relative;
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #1a1a2e 0%, #090912 100%);
          overflow: hidden;
        }

        .vignette-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 50%, transparent 0%, #000 120%);
          z-index: 1;
        }

        .container {
          position: relative; z-index: 5;
          max-width: 1200px; margin: 0 auto; padding: 4rem 2rem;
          display: flex; flex-direction: column; align-items: center;
        }

        /* --- HERO SECTION --- */
        .hero-section { text-align: center; margin-bottom: 5rem; perspective: 1000px; }

        .icon-3d-container {
          position: relative; width: 100px; height: 100px; margin: 0 auto 2rem;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-3d {
          font-size: 4rem; z-index: 2;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(79,172,254,0.5));
        }
        .icon-ring {
          position: absolute; width: 100%; height: 100%;
          border: 2px solid rgba(79,172,254,0.3); border-radius: 50%;
          transform: rotateX(70deg);
          animation: spin 4s linear infinite;
        }
        .ring-2 { width: 140%; height: 140%; animation-direction: reverse; animation-duration: 7s; border-color: rgba(0,242,254,0.2); }

        .main-title {
          font-size: 5rem; font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem;
          background: linear-gradient(to bottom, #fff, #a5b4fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .subtitle {
          font-size: 1.25rem; color: #94a3b8; max-width: 600px; margin: 0 auto 3rem; line-height: 1.6;
        }
        .highlight { color: var(--secondary); font-weight: bold; text-shadow: 0 0 10px rgba(0,242,254,0.3); }

        /* --- GLITCH EFFECT --- */
        .glitch {
          position: relative; color: white; -webkit-text-fill-color: white;
        }
        .glitch::before, .glitch::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: var(--bg-dark); opacity: 0.8;
        }
        .glitch::before {
          color: #ff00ff; z-index: -1; animation: glitch-effect 3s infinite;
        }
        .glitch::after {
          color: #00ffff; z-index: -2; animation: glitch-effect 2s infinite reverse;
        }

        /* --- BUTTONS --- */
        .cta-group { display: flex; gap: 1.5rem; justify-content: center; }
        
        .btn {
          position: relative; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600;
          text-decoration: none; border-radius: 12px; transition: transform 0.2s; overflow: hidden;
        }
        .btn:hover { transform: translateY(-3px); }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: #000; box-shadow: 0 0 20px rgba(79,172,254,0.4);
        }
        .btn-shine {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent);
          transform: skewX(-25deg); animation: shine 6s infinite;
        }

        .btn-glass {
          background: rgba(255,255,255,0.05); color: white;
          border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px);
        }
        .btn-glass:hover { background: rgba(255,255,255,0.1); border-color: white; }

        /* --- SPOTLIGHT CARDS --- */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; width: 100%;
        }

        .spotlight-card {
          position: relative; padding: 2.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden; cursor: default;
        }

        .spotlight-glow {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; transition: opacity 0.3s ease;
        }
        .spotlight-border {
          position: absolute; inset: 0; pointer-events: none; z-index: 2; transition: opacity 0.3s ease;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          padding: 1px; /* border width */
          border-radius: inherit;
        }

        .card-content { position: relative; z-index: 3; }
        
        .icon-wrapper {
          font-size: 2.5rem; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .spotlight-card h3 { font-size: 1.5rem; margin: 0 0 0.5rem;color: #f7f7f7; }
        .spotlight-card p { color: #94a3b8; line-height: 1.6; font-size: 1rem; margin: 0; }

        /* --- ANIMATIONS --- */
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { 0% { transform: rotateX(70deg) rotateZ(0deg); } 100% { transform: rotateX(70deg) rotateZ(360deg); } }
        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
        @keyframes glitch-effect {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 40% 0); transform: translate(1px, -1px); }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .main-title { font-size: 3rem; }
          .hero-section { perspective: none; }
          .cta-group { flex-direction: column; }
          .btn { width: 100%; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
};

export default Home;