'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chatkit/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        messages: messages,
      }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  }

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: 20 }}>
      <h2>STEAMLURAVI</h2>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.role === 'user' ? 'Tú' : 'STEAMLURAVI'}:</b> {m.content}
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Pensando...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Enviar</button>
      </div>
    </main>
  );
}
