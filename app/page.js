'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chatkit/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, messages }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  }

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', background: '#f0f4f8' }}>

      <div style={{ background: '#1D9E75', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 500, fontSize: 20 }}>S</div>
        <div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>STEAMLURAVI</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Profesor experto en educación STEAM</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['Ciencia', 'Tecnología', 'Arte', 'Matemáticas'].map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11, padding: '3px 8px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 500, fontSize: 13, flexShrink: 0 }}>S</div>
          <div style={{ background: 'white', padding: '10px 16px', borderRadius: '4px 18px 18px 18px', maxWidth: '70%', fontSize: 14, lineHeight: 1.6, boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
            👋 ¡Hola! Soy <strong>STEAMLURAVI</strong>, tu profesor virtual de ciencia, tecnología, ingeniería, arte y matemáticas.
            <br /><br />
            Para darte la mejor respuesta posible, dime primero: <strong>¿en qué curso estás?</strong> (1º ESO, 2º Bachillerato, etc.)
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 500, fontSize: 13, flexShrink: 0 }}>S</div>
            )}
            <div style={{
              background: m.role === 'user' ? '#1D9E75' : 'white',
              color: m.role === 'user' ? 'white' : '#222',
              padding: '10px 16px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              maxWidth: '70%',
              fontSize: 14,
              lineHeight: 1.6,
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}>
              {m.role === 'assistant' ? (
                <ReactMarkdown>{m.content}</ReactMarkdown>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 500, fontSize: 13 }}>S</div>
            <div style={{ background: 'white', padding: '10px 16px', borderRadius: '4px 18px 18px 18px', fontSize: 14, color: '#888', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
              Pensando...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 16, background: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, padding: '10px 16px', borderRadius: 24, border: '1px solid #ddd', fontSize: 14, outline: 'none' }}
        />
        <button
          onClick={sendMessage}
          style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >→</button>
      </div>
    </main>
  );
}
