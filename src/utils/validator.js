/**
 * Validates an XML document against a specific XSD structure.
 * Note: Browsers cannot natively validate XSD. This function manually checks 
 * if the required elements defined in the XSD exist in the XML.
 */
export const validateXml = (xmlDoc, xsdString) => {
  const errors = [];
  
  if (!xsdString) {
    console.warn("No XSD provided for validation.");
    return [];
  }

  const parser = new DOMParser();
  const xsdDoc = parser.parseFromString(xsdString, "text/xml");

  const rootElement = xsdDoc.querySelector("schema > element") || xsdDoc.querySelector("xs\\:schema > xs\\:element");
  
  if (rootElement) {
    const expectedRoot = rootElement.getAttribute("name");
    if (xmlDoc.documentElement.nodeName !== expectedRoot) {
      errors.push(`Root tag mismatch. Expected <${expectedRoot}> but found <${xmlDoc.documentElement.nodeName}>.`);
      return errors; 
    }
  }

  const definedElements = xsdDoc.querySelectorAll("element, xs\\:element");
  
  definedElements.forEach((el) => {
    const tagName = el.getAttribute("name");
    if (tagName && tagName !== xmlDoc.documentElement.nodeName) {
      const foundInXml = xmlDoc.getElementsByTagName(tagName);
      if (foundInXml.length === 0) {
        errors.push(`Missing required element: <${tagName}>`);
      }
    }
  });

  
  return errors;
};