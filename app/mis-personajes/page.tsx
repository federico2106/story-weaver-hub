'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CharacterCard from '@/app/components/CharacterCard'

export default function MisPersonajesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [characters, setCharacters] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const { data } = await supabase
        .from('custom_characters')
        .select('slug, name, subtitle, image_url, description')
        .eq('user_id', session.user.id)

      if (data) {
        setCharacters(data.map(c => ({
          id: c.slug,
          name: c.name,
          subtitle: c.subtitle,
          image: c.image_url,
          description: c.description
        })))
      }

      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-200">✨ Mis Creaciones</h1>

      {characters.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-sm text-gray-400 mb-4">Todavía no creaste ningún personaje propio.</p>
          <Link
            href="/crear-personaje"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
          >
            ✨ Crear mi primer personaje
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} isCustom={true} />
          ))}
        </div>
      )}
    </div>
  )
}
