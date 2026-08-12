'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const name = (params?.name as string) || 'personaje';
  
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          characterName: name,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-100 p-4 max-w-2xl mx-auto">
      <header className="py-4 border-b border-neutral-800 mb-4 capitalize font-bold text-lg flex justify-between items-center">
        <span>Chat con {name}</span>
        <a href="/" className="text-xs text-neutral-400 hover:text-white underline">Volver al inicio</a>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-neutral-800 ml-auto text-right' 
                : 'bg-neutral-900 border border-neutral-800 mr-auto'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {loading && <p className="text-xs text-neutral-500 animate-pulse">Escribiendo...</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-neutral-600 text-neutral-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded text-sm transition font-medium"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
