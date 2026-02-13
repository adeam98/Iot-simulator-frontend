/**
 * Merges Config and Data XMLs and applies XSLT transformation.
 * * @param {string} sensorXml - The sensor data XML string
 * @param {string} configXml - The device configuration XML string
 * @param {string} xsltCode  - The XSLT content string
 * @returns {string} The resulting HTML string
 */
export const transformXmlReport = (sensorXml, configXml, xsltCode) => {
  try {
    if (!sensorXml || !configXml || !xsltCode) {
      console.warn("Missing XML inputs for transformation");
      return "<p>Waiting for data...</p>";
    }

   
    const cleanSensor = sensorXml.replace(/<\?xml.*?\?>/, '').trim();
    const cleanConfig = configXml.replace(/<\?xml.*?\?>/, '').trim();

    const mergedXml = `
      <Payload>
        ${cleanConfig}
        ${cleanSensor}
      </Payload>
    `;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(mergedXml, "text/xml");
    const xsltDoc = parser.parseFromString(xsltCode, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("XML Parse Error in Merged Data");
    }

    const processor = new XSLTProcessor();
    processor.importStylesheet(xsltDoc);
    
    const resultDoc = processor.transformToFragment(xmlDoc, document);
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(resultDoc);

  } catch (error) {
    console.error("Transformation Failed:", error);
    return `<div style="color:red; padding:20px; border:1px solid red;">
              <h3>Transformation Error</h3>
              <p>${error.message}</p>
            </div>`;
  }
};