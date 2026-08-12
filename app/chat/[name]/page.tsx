'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const characterId = params?.id as string;

  // Datos básicos según el personaje
  const characterInfo: Record<string, { name: string; subtitle: string }> = {
    elena: { name: 'Elena', subtitle: 'Romance Profundo • Activa ahora' },
    samantha: { name: 'Samantha', subtitle: 'Drama Íntimo • Activa ahora' },
  };

  const currentCharacter = characterInfo[characterId] || { name: 'Compañía', subtitle: 'Hub Activo' };

  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hola. Qué bueno que hayas llegado por aquí. ¿De qué te gustaría hablar hoy?` }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    // Simulamos una respuesta automática del personaje
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Entiendo perfectamente lo que dices sobre "${userMessage}". Sigamos explorando ese pensamiento juntos...` }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between">
      {/* Navbar Superior del Chat */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="bg-neutral-900 border border-neutral-800 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors">
            &larr; Volver
          </Link>
          <div>
            <h1 className="font-bold text-sm">{currentCharacter.name}</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentCharacter.subtitle}
            </p>
          </div>
        </div>
        <div className="text-xs text-neutral-500 font-mono">STORY WEAVER HUB</div>
      </header>

      {/* Contenedor de Mensajes */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 overflow-y-auto space-y-4 mb-20">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-white text-neutral-950 rounded-br-none font-medium'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      {/* Barra de Entrada de Texto */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-900 p-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Escribe tu mensaje o comparte un pensamiento..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          <button
            type="submit"
            className="bg-white text-neutral-950 px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Enviar
          </button>
        </form>
      </footer>
    </div>
  );
}