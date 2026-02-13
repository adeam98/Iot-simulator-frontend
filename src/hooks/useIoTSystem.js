import { useState, useEffect } from 'react';
import { parseXml } from '../utils/xmlParser';
import { validateXml } from '../utils/validator';
import { analyzeData } from '../utils/analyzer';
import { transformXmlReport } from '../utils/transformer'; 

export const useIoTSystem = () => {
  const [configXml, setConfigXml] = useState("");
  const [sensorXml, setSensorXml] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [htmlReport, setHtmlReport] = useState("");

  
  const [schemas, setSchemas] = useState({ config: "", sensor: "" });


  useEffect(() => {
    Promise.all([
      fetch('/xsd/device_config.xsd').then(res => res.text()),
      fetch('/xsd/sensor_data.xsd').then(res => res.text())
    ]).then(([config, sensor]) => {
      setSchemas({ config, sensor });
    }).catch(err => console.error("Failed to load schemas:", err));
  }, []);

  const processData = async (configInput, sensorInput) => {
    const effectiveConfig = configInput !== undefined ? configInput : configXml;
    const effectiveSensor = sensorInput !== undefined ? sensorInput : sensorXml;

    if (configInput) setConfigXml(configInput);
    if (sensorInput) setSensorXml(sensorInput);

    if (!effectiveConfig || !effectiveSensor) return;

    const configDoc = parseXml(effectiveConfig);
    const sensorDoc = parseXml(effectiveSensor);
    if (!configDoc || !sensorDoc) return;

    const configErrors = validateXml(configDoc, schemas.config);
    const sensorErrors = validateXml(sensorDoc, schemas.sensor);

    if (configErrors.length > 0 || sensorErrors.length > 0) {
      setAlerts([...configErrors, ...sensorErrors]);
      return; 
    }

    const { parsedData, alerts: sensorAlerts } = analyzeData(configDoc, sensorDoc);
    setDashboardData(parsedData);
    setAlerts(sensorAlerts);

    const htmlResult = transformXmlReport(sensorDoc, configXml, '/xslt/sensor_to_html.xslt');
    setHtmlReport(htmlResult);
  };

  return {
    configXml,
    sensorXml,
    dashboardData,
    alerts,
    htmlReport, 
    processData
  };
};