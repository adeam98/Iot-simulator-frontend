/**
 * @param {string} xmlString 
 * @returns {XMLDocument|null} 
 */
export const parseXml = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    const errorNode = xmlDoc.querySelector("parsererror");
    if (errorNode) {
      console.error("XML Parsing Error:", errorNode.textContent);
      throw new Error("Invalid XML Format");
    }
    
    return xmlDoc;
  } catch (err) {
    console.error("Parsing Exception:", err);
    return null;
  }
};