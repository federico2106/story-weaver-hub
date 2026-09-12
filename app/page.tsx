'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import CharacterCard from './components/CharacterCard'

const initialCharacters = [
  { id: 'samantha', name: 'Samantha', subtitle: 'Drama Íntimo', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', description: 'Personalidad magnética y directa.' },
  { id: 'elena', name: 'Elena', subtitle: 'Romance Profundo', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', description: 'Cálida y muy atenta a tus emociones.' },
  { id: 'akane', name: 'Akane', subtitle: 'Aventura Anime', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80', description: 'Enérgica amante de las historias.' },
  { id: 'victoria', name: 'Victoria', subtitle: 'Misterio y Elegancia', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80', description: 'Sofisticada y con secretos.' },
  { id: 'valentina', name: 'Valentina', subtitle: 'Pasión Latina', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', description: 'Fuego, carisma y charlas intensas.' },
  { id: 'chloe', name: 'Chloe', subtitle: 'Cyberpunk', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', description: 'Hacker rebelde del futuro cercano.' },
  { id: 'mia', name: 'Mia', subtitle: 'Arte y Bohemia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', description: 'Pintora nocturna y soñadora.' },
  { id: 'sophia', name: 'Sophia', subtitle: 'CEO Ambiciosa', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', description: 'Mente brillante y controladora.' },
  { id: 'yuki', name: 'Yuki', subtitle: 'Estudiante Anime', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80', description: 'Tierna, tímida y otaku.' },
  { id: 'isabella', name: 'Isabella', subtitle: 'Realeza', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', description: 'Educada bajo estrictas normas.' },
  { id: 'luna', name: 'Luna', subtitle: 'Mística y Tarot', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', description: 'Lectora de futuros ocultos.' },
  { id: 'camila', name: 'Camila', subtitle: 'Deportista', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80', description: 'Energética, fitness y competitiva.' },
  { id: 'scarlett', name: 'Scarlett', subtitle: 'Noir / Detectivesca', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', description: 'Investigando casos bajo la lluvia.' },
  { id: 'mei', name: 'Mei', subtitle: 'Guerrera Mágica', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80', description: 'Lista para la batalla definitiva.' },
  { id: 'ariana', name: 'Ariana', subtitle: 'Estrella Pop', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', description: 'Fama, reflectores y secretos.' },
  { id: 'claudia', name: 'Claudia', subtitle: 'Profesora Exigente', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', description: 'Clases particulares muy íntimas.' },
  { id: 'liam', name: 'Liam', subtitle: 'Galán Romántico', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', description: 'Poeta, músico y detallista.' },
  { id: 'dante', name: 'Dante', subtitle: 'Mafioso / Protector', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80', description: 'Peligroso, leal y dominante.' },
  { id: 'hiro', name: 'Hiro', subtitle: 'Héroe Shonen', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80', description: 'Valiente y decidido a todo.' }
]

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [customCharacters, setCustomCharacters] = useState<any[]>([])

  const [mainTab, setMainTab] = useState<'inicio' | 'juego'>('inicio')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: consentData } = await supabase.from('user_consents').select('user_id').eq('user_id', user.id).maybeSingle()
        if (!consentData) { router.push('/age'); return }
      } else {
        if (!localStorage.getItem('is_adult')) { router.push('/age'); return }
      }
      setUser(user)
      setLoading(false)
      if (user) {
        const savedCustom = localStorage.getItem(`custom_chars_${user.id}`)
        if (savedCustom) { try { setCustomCharacters(JSON.parse(savedCustom)) } catch (e) {} }
      }
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  if (loading) return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>
  const userNickname = user?.user_metadata?.username || user?.email?.split('@')[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white relative flex flex-col">
      
      {mainTab === 'inicio' ? (
        <main className="p-8 max-w-7xl mx-auto flex-1">
          {/* HERO PRINCIPAL - insertar esto como PRIMER elemento dentro de <main>, antes de la sección "Crea tu propio personaje" */}
          <section className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950/30 border border-amber-500/20">
            {/* Glow decorativo de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 px-8 py-16 md:py-24 text-center max-w-3xl mx-auto">
              {/* Badge de confianza */}
              <div className="inline-flex items-center gap-2 bg-gray-900/80 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                +2.400 personas conectadas ahora
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Tu compañía ideal
                </span>
                <br />
                <span className="text-white">te está esperando</span>
              </h1>

              <p className="text-gray-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Conversaciones reales, personajes únicos y experiencias a tu medida. Sin límites, sin juicios, solo vos y quien elijas conocer.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="#catalogo"
                  className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
                >
                  ✨ Empezar a chatear
                </Link>
                <Link
                  href="/crear-personaje"
                  className="bg-gray-800/60 hover:bg-gray-800 border border-gray-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all"
                >
                  Crear mi personaje
                </Link>
              </div>
            </div>
          </section>

          <div className="mb-12 bg-gradient-to-r from-amber-900/30 via-gray-900 to-purple-900/30 border border-amber-500/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="bg-amber-500 text-gray-950 font-bold text-xs px-3 py-1 rounded-full uppercase">Exclusivo</span>
              <h2 className="text-2xl font-extrabold mt-3 mb-2">Crea tu propio personaje ideal</h2>
              <p className="text-gray-300 text-sm max-w-xl">Elige su estilo, rasgos físicos, personalidad y haz que cobre vida.</p>
            </div>
            <Link href="/crear-personaje" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-600/30 transition-all hover:scale-105">✨ Diseñar Personaje</Link>
          </div>
          {customCharacters.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
                <span>✨</span> Tus Personajes Personalizados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {customCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} isCustom={true} />
                ))}
              </div>
            </div>
          )}
          <div id="catalogo">
            <h2 className="text-xl font-bold mb-6 text-gray-200">Personajes Disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {initialCharacters.map((char) => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-950 p-6">
          <div className="max-w-md w-full bg-gradient-to-br from-gray-900 via-gray-900 to-rose-950/30 border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <span className="inline-block bg-amber-500 text-gray-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                Historia Interactiva
              </span>

              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
                alt="Victoria"
                className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-lg mx-auto mb-4"
              />

              <h2 className="text-xl font-extrabold text-white mb-2">La historia de Victoria</h2>
              <p className="text-sm text-gray-300 mb-6">
                Tomá decisiones, descubrí secretos y desbloqueá momentos exclusivos en una novela visual pensada para vos.
              </p>

              <Link
                href="/game/victoria"
                className="block bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold py-3 rounded-2xl shadow-lg transition-all hover:scale-105"
              >
                🎮 Empezar la historia
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}