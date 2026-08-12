'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState('todos');

  const characters = [
    {
      id: 'elena',
      name: 'Elena',
      genre: 'romance',
      genreLabel: 'Romance Profundo',
      image: '/elena.jpg',
      description: 'Encuentra compañía nocturna y una cercanía que se construye paso a paso.',
      href: '/chat/elena',
      badge: '✨ Destacado',
    },
    {
      id: 'samantha',
      name: 'Samantha',
      genre: 'drama',
      genreLabel: 'Drama Íntimo',
      image: '/samantha.jpg',
      description: 'Atenta, analítica y dispuesta a descifrar cada capa de tus pensamientos.',
      href: '/chat/samantha',
      badge: 'Nuevo',
    },
  ];

  const filteredCharacters = selectedGenre === 'todos' 
    ? characters 
    : characters.filter(char => char.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      
      {/* BARRA DE NAVEGACIÓN PRINCIPAL (ÚNICA) */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
  <Link href="/" className="font-extrabold tracking-wider text-lg text-white">
  STORY WEAVER <span className="text-xs font-bold text-pink-500 tracking-widest ml-1 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">HUB</span>
</Link>
            <nav className="hidden md:flex space-x-6 text-sm text-neutral-400 font-medium">
              <Link href="/" className="text-white hover:text-white transition-colors">Inicio</Link>
              <Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link>
              <Link href="/relatos" className="hover:text-white transition-colors">Relatos</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/ingresar" 
              className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-8 max-w-6xl mx-auto pt-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-300 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>+1,420 usuarios conversando ahora mismo</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Elige tu compañía</h1>
          <p className="text-neutral-400">Explora mundos narrativos profundos y conversaciones íntimas.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'romance', label: 'Romance' },
            { id: 'terror', label: 'Terror' },
            { id: 'sci-fi', label: 'Sci-Fi' },
            { id: 'drama', label: 'Drama' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGenre(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedGenre === tab.id
                  ? 'bg-white text-neutral-950 shadow-lg scale-105'
                  : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCharacters.map((char) => (
            <Link key={char.id} href={char.href} className="group">
              <article className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-2 ring-neutral-800/50 hover:ring-neutral-600/80 transition-all duration-700 ease-out hover:scale-105">
                <img
                  src={char.image}
                  alt={char.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-center w-full">
                    <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      {char.badge}
                    </span>
                    <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                      {char.genreLabel}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-bold text-3xl text-white mb-2">{char.name}</h2>
                    <p className="text-sm text-white/90 mb-4 line-clamp-2">
                      {char.description}
                    </p>
                    <span className="inline-block bg-white text-neutral-950 px-6 py-2.5 rounded-full font-semibold text-sm transition-colors group-hover:bg-neutral-200">
                      Iniciar Conversación
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}