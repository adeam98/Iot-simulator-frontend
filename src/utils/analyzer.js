/**
 * Analyzes sensor data against configuration thresholds using XPath.
 * @param {XMLDocument} configDoc - The configuration XML.
 * @param {XMLDocument} sensorDoc - The sensor data XML.
 * @returns {Object} - Contains parsed data for the UI and any alerts found.
 */
export const analyzeData = (configDoc, sensorDoc) => {
  const alerts = [];
  const sensors = [];
  
  const deviceId = configDoc.querySelector("DeviceId")?.textContent || "Unknown";
  const protocol = configDoc.querySelector("Protocol")?.textContent || "N/A"; 
  const frequency = configDoc.querySelector("Frequency")?.textContent || "N/A";

  const readings = sensorDoc.querySelectorAll("Reading");
  
  readings.forEach((reading) => {
    const type = reading.getAttribute("type");
    const value = parseFloat(reading.querySelector("Value").textContent);
    
    const xpath = `//SensorConfig[@type='${type}']`;
    
    const result = configDoc.evaluate(
      xpath, 
      configDoc, 
      null, 
      XPathResult.FIRST_ORDERED_NODE_TYPE, 
      null
    );
    const configNode = result.singleNodeValue;

    let unit = "";
    let threshold = Infinity;

    if (configNode) {
      unit = configNode.querySelector("Unit")?.textContent;
      
      const thresholdNode = configNode.querySelector("Threshold") || configNode.querySelector("Max");
      
      if (thresholdNode) {
        threshold = parseFloat(thresholdNode.textContent);
        
        if (value > threshold) {
          alerts.push(`⚠️ ${type} is ${value} ${unit} (Threshold: ${threshold} ${unit})`);
        }
      }
    }

    sensors.push({
      type,
      value,
      unit,
      threshold: threshold !== Infinity ? threshold : 100, // Default for visualization scale
      timestamp: new Date().toLocaleTimeString()
    });
  });

  return {
    parsedData: {
      deviceId,
      protocol,   // <--- Passed to Dashboard
      frequency,  // <--- Passed to Dashboard
      sensors
    },
    alerts
  };
};