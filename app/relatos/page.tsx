'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// Base de datos de relatos de ejemplo
const storiesList = [
  {
    id: 1,
    title: 'Noche de secretos en la ciudad',
    character: 'Samantha',
    excerpt: 'La lluvia caía sobre el ventanal mientras Samantha me miraba con una sonrisa indescifrable...',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    readTime: '4 min'
  },
  {
    id: 2,
    title: 'Un café bajo cero',
    character: 'Elena',
    excerpt: 'El vapor de las tazas de café era lo único cálido en esa pequeña cafetería apartada de todo...',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    readTime: '6 min'
  },
  {
    id: 3,
    title: 'Operación neón',
    character: 'Chloe',
    excerpt: 'Los códigos corrían por las pantallas holográficas a una velocidad vertiginosa...',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80',
    readTime: '5 min'
  }
]

export default function RelatosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Cabecera */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-gray-900/50">
        <Link href="/" className="text-gray-400 hover:text-white text-sm font-semibold">
          ← Volver al inicio
        </Link>
        <h1 className="text-lg font-bold text-amber-400">📖 Relatos Interactivos</h1>
        <div className="w-20"></div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">Historias y Capítulos Exclusivos</h2>
          <p className="text-gray-400 text-sm">Sumérgete en narrativas especiales protagonizadas por los personajes de la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {storiesList.map((story) => (
            <div key={story.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div className="h-48 overflow-hidden relative">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                  ⏱ {story.readTime}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{story.character}</span>
                  <h3 className="text-lg font-bold mt-1 mb-2">{story.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{story.excerpt}</p>
                </div>
                <button 
                  onClick={() => alert(`Próximamente: Lectura completa de "${story.title}"`)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-xl font-semibold transition-colors text-sm"
                >
                  Leer relato
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}