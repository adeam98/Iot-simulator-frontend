import React, { useState, useEffect } from 'react'; // 1. Add useState, useEffect
import UploadForm from '../components/UploadForm';
import Dashboard from '../components/Dashboard';
import XmlViewer from '../components/XmlViewer';
import ToastContainer from '../components/ToastContainer';
import { useIoTSystem } from '../hooks/useIoTSystem';

// 2. Import the transformer utility you created
import { transformXmlReport } from '../utils/transformer'; 

const Simulator = () => {
  // We don't need 'htmlReport' from the hook anymore, we will generate it here
  const { configXml, sensorXml, dashboardData, alerts, processData } = useIoTSystem();

  // 3. Local state to hold the XSLT code and the final HTML report
  const [xsltCode, setXsltCode] = useState("");
  const [finalReport, setFinalReport] = useState("");

  // 4. LOAD XSLT FILE: Fetch the file from /public/xslt/ when component mounts
  useEffect(() => {
    fetch('/xslt/sensor_to_html.xslt')
      .then(response => response.text())
      .then(text => setXsltCode(text))
      .catch(err => console.error("Error loading XSLT:", err));
  }, []);

  // 5. GENERATE REPORT: Run whenever Config, Sensor Data, or XSLT changes
  useEffect(() => {
    if (configXml && sensorXml && xsltCode) {
      const html = transformXmlReport(sensorXml, configXml, xsltCode);
      setFinalReport(html);
    }
  }, [configXml, sensorXml, xsltCode]);

  return (
    <div className="container">
      <ToastContainer alerts={alerts} />

      <div style={{ marginBottom: '2rem' }}>
        <h1>🎛️ Contrôle du simulateur</h1>
        <p style={{ color: '#64748b' }}>Gérez les entrées de vos dispositifs IoT et visualisez les sorties en temps réel.</p>
      </div>
      
      <div className="dashboard-grid">
        
        {/* LEFT: Controls */}
        <div className="sidebar">
          {/* Ensure UploadForm calls processData correctly */}
          <UploadForm onUpload={processData} />
          
          {/* 6. RENDER THE GENERATED REPORT */}
          {finalReport ? (
            <div className="card" style={{ marginTop: '20px', background: '#1e293b', border: 'none', color: '#cbd5e1' }}>
              <h4 style={{ color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                📟 System Terminal (XSLT)
              </h4>
              <div 
                 style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.8 }}
                 dangerouslySetInnerHTML={{ __html: finalReport }} 
              />
            </div>
          ) : (
             /* Optional: Show empty state if no report yet */
             <div style={{marginTop: '20px', color: '#64748b', fontSize: '0.8rem'}}>
                waiting for data & config...
             </div>
          )}
        </div>

        {/* RIGHT: Visuals */}
        <div className="main-content">
          
          {dashboardData ? (
            <Dashboard data={dashboardData} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>💤</div>
              <h3>yalah tlqna lfraja</h3>
              <p style={{ color: '#94a3b8' }}>Upload your XML files to activate the sensors.</p>
            </div>
          )}
          
          {/* Code Viewers */}
          {dashboardData && (
            <div style={{ marginTop: '30px' }}>
               <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📄 Source Data</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <XmlViewer title="Config" content={configXml} />
                  <XmlViewer title="Sensor" content={sensorXml} />
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Simulator;