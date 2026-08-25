'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ComunidadPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados del formulario para crear un relato
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [communityStories, setCommunityStories] = useState([])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)

      // Cargar relatos previos de la comunidad desde localStorage
      const savedStories = localStorage.getItem('community_stories')
      if (savedStories) {
        try { setCommunityStories(JSON.parse(savedStories)) } catch (e) {}
      }
    }
    init()
  }, [router])

  const handlePublish = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('Por favor, completa el título y el contenido del relato.')
      return
    }

    const newStory = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim() || user.email.split('@')[0],
      content: content.trim(),
      date: new Date().toLocaleDateString()
    }

    const updatedStories = [newStory, ...communityStories]
    setCommunityStories(updatedStories)
    localStorage.setItem('community_stories', JSON.stringify(updatedStories))

    // Limpiar formulario
    setTitle('')
    setAuthor('')
    setContent('')
    alert('¡Relato publicado con éxito en la comunidad!')
  }

  if (loading) return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Cabecera */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-gray-900/50">
        <Link href="/" className="text-gray-400 hover:text-white text-sm font-semibold">
          ← Volver al inicio
        </Link>
        <h1 className="text-lg font-bold text-amber-400">🌐 Comunidad y Relatos de Usuarios</h1>
        <div className="w-20"></div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-12">
        
        {/* SECCIÓN: ESCRIBIR UN RELATO */}
        <div className="bg-gray-900 border border-amber-500/40 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-black mb-2">Comparte tu propia historia</h2>
          <p className="text-gray-400 text-sm mb-6">Escribe tu relato interactivo, fanfic o experiencia para que otros usuarios de la comunidad puedan leerlo.</p>

          <form onSubmit={handlePublish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Título del Relato</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Una noche bajo la lluvia con..."
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Tu Seudónimo / Autor (Opcional)</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ej: Anónimo o tu alias"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Contenido del Relato</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu historia aquí..."
                rows={6}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-amber-600/30 transition-all text-sm"
            >
              ✍️ Publicar Relato en la Comunidad
            </button>
          </form>
        </div>

        {/* SECCIÓN: MURO DE RELATOS DE LA COMUNIDAD */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-gray-200">Relatos publicados por la comunidad</h2>
          
          {communityStories.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
              Aún no hay relatos publicados. ¡Sé el primero en escribir uno arriba!
            </div>
          ) : (
            <div className="space-y-6">
              {communityStories.map((story) => (
                <div key={story.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:border-amber-500/40 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-amber-400">{story.title}</h3>
                      <span className="text-xs text-gray-400">Por: <strong className="text-gray-300">{story.author}</strong> — {story.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mt-4 bg-gray-950/50 p-4 rounded-xl border border-gray-800/60">
                    {story.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}