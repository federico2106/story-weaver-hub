'use client';
import { useState, useEffect } from 'react';

export default function RelatosPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Cargar las voces disponibles en el navegador al entrar a la página
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filtramos preferiblemente las voces en español
      setVoices(availableVoices.filter(v => v.lang.startsWith('es')));
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Función para reproducir un relato con una voz específica
  const handlePlay = (id: number, text: string, voiceIndex: number) => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la reproducción de audio por voz.');
      return;
    }

    // Detener cualquier audio anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Asignar la voz elegida si existe, de lo contrario usa la predeterminada
    if (voices.length > 0 && voices[voiceIndex]) {
      utterance.voice = voices[voiceIndex];
    }
    
    utterance.rate = 0.95; // Velocidad ligeramente pausada para darle dramatismo
    utterance.pitch = 1.0;

    utterance.onend = () => setPlayingId(null);
    
    setPlayingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 max-w-4xl mx-auto">
      {/* Botón de regreso */}
      <div className="mb-8">
        <a href="/" className="text-sm text-neutral-400 hover:text-white transition">
          ← Volver al inicio
        </a>
      </div>

      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-wider text-white">Relatos Exclusivos</h1>
        <p className="text-neutral-400 mt-2 text-sm">Escucha las historias narradas con diferentes voces y matices.</p>
      </header>

      {/* Lista de Relatos */}
      <div className="space-y-6">
        
        {/* Relato 1 - Narrado por Samantha (Voz 0 o la primera disponible) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">Narrado por Samantha</span>
            <h3 className="text-xl font-bold text-white mt-1">Ecos de Medianoche</h3>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Un capítulo exclusivo explorando los recuerdos más íntimos y las dudas que surgen en la oscuridad de la habitación.
            </p>
            <span className="text-xs text-neutral-500 mt-3 inline-block">Duración estimada: Lectura en vivo</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {playingId === 1 ? (
              <button 
                onClick={handleStop}
                className="bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-600/30 text-sm font-medium px-5 py-2.5 rounded-lg transition w-full md:w-auto text-center"
              >
                Detener
              </button>
            ) : (
              <button 
                onClick={() => handlePlay(1, "Ecos de Medianoche. Un capítulo exclusivo explorando los recuerdos más íntimos y las dudas que surgen en la oscuridad de la habitación.", 0)}
                className="bg-white text-neutral-950 hover:bg-neutral-200 text-sm font-semibold px-5 py-2.5 rounded-lg transition w-full md:w-auto text-center"
              >
                Reproducir Audio
              </button>
            )}
          </div>
        </div>

        {/* Relato 2 - Narrado por Elena (Voz 1 o la segunda disponible) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Narrado por Elena</span>
            <h3 className="text-xl font-bold text-white mt-1">Confesiones Bajo la Lluvia</h3>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Una charla sin filtros sobre lo que significa arriesgarlo todo por un vínculo genuino y profundo.
            </p>
            <span className="text-xs text-neutral-500 mt-3 inline-block">Duración estimada: Lectura en vivo</span>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {playingId === 2 ? (
              <button 
                onClick={handleStop}
                className="bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-600/30 text-sm font-medium px-5 py-2.5 rounded-lg transition w-full md:w-auto text-center"
              >
                Detener
              </button>
            ) : (
              <button 
                onClick={() => handlePlay(2, "Confesiones Bajo la Lluvia. Una charla sin filtros sobre lo que significa arriesgarlo todo por un vínculo genuino y profundo.", 1)}
                className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition w-full md:w-auto text-center"
              >
                Reproducir Audio
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}