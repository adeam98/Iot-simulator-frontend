import React, { useEffect, useMemo, useState } from 'react';

const simplePrettify = (raw) => {
  try {
    const p = new DOMParser().parseFromString(raw.trim(), 'application/xml');
    if (p.querySelector('parsererror')) return raw; 
    const serialize = (node, indent = '') => {
      if (node.nodeType === Node.TEXT_NODE) {
        const t = node.nodeValue.trim();
        return t ? indent + t + '\n' : '';
      }
      if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return indent + `<![CDATA[${node.nodeValue}]]>\n`;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.nodeName;
        const attrs = Array.from(node.attributes || []).map(a => ` ${a.name}="${a.value}"`).join('');
        if (!node.childNodes.length) return `${indent}<${tag}${attrs} />\n`;
        const open = `${indent}<${tag}${attrs}>\n`;
        const children = Array.from(node.childNodes).map(c => serialize(c, indent + '  ')).join('');
        const close = `${indent}</${tag}>\n`;
        return open + children + close;
      }
      return '';
    };
    let out = '';
    p.childNodes.forEach(n => { out += serialize(n, ''); });
    return out.trim();
  } catch {
    return raw;
  }
};

const XmlViewerSimple = ({ title = 'XML', content = '' }) => {
  const [pretty, setPretty] = useState(true);
  const [flash, setFlash] = useState(false);

  
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 380);
    return () => clearTimeout(t);
  }, [content]);

  const displayed = useMemo(() => (pretty ? simplePrettify(content) : content), [content, pretty]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(displayed);
      setFlash(true);
      setTimeout(() => setFlash(false), 420);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const download = (ext = 'xml') => {
    const blob = new Blob([displayed], { type: ext === 'xml' ? 'application/xml' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'document').replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!content) return null;

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: 'none',
        background: '#0b1220',
        borderRadius: 10,
        boxShadow: flash ? '0 8px 30px rgba(59,130,246,0.08)' : '0 8px 24px rgba(2,6,23,0.45)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#071024',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #19233a',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, background: '#22c55e', borderRadius: 6, display: 'inline-block' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.95rem' }}>{title}</span>
          <span style={{ color: '#64748b', fontSize: 12, fontFamily: 'monospace', marginLeft: 8 }}>READ-ONLY</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setPretty(p => !p)}
            style={{
              background: '#0f172a',
              color: '#e6eef8',
              border: '1px solid #233044',
              padding: '6px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            {pretty ? 'Minify' : 'Prettify'}
          </button>

          <button
            onClick={copy}
            style={{
              background: '#0f172a',
              color: '#e6eef8',
              border: '1px solid #233044',
              padding: '6px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Copy
          </button>

          <button
            onClick={() => download('xml')}
            style={{
              background: '#fff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              padding: '6px 10px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Download
          </button>
        </div>
      </div>

      {/* Body */}
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          color: '#e2e8f0',
          fontFamily: "'Fira Code', 'Consolas', monospace",
          fontSize: '0.86rem',
          overflowX: 'auto',
          lineHeight: 1.6,
          whiteSpace: 'pre',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))',
        }}
      >
        {displayed}
      </pre>
    </div>
  );
};

export default XmlViewerSimple;
