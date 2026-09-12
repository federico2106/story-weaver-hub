'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const STORIES = {
  victoria: {
    name: 'Victoria',
    startScene: 'intro',
    scenes: {
      intro: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Victoria te recibe en la entrada de una vieja mansión, con una sonrisa que esconde más de lo que muestra. "Llegaste justo a tiempo", te dice.',
        choices: [
          { label: 'Preguntarle sobre el lugar', next: 'lugar', locked: false },
          { label: 'Seguirla en silencio', next: 'silencio', locked: false }
        ]
      },
      lugar: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: '"Esta casa guarda secretos de generaciones", responde, mirándote con curiosidad genuina. Te invita a sentarte junto a ella.',
        choices: [
          { label: 'Aceptar y sentarte', next: 'conversacion', locked: false },
          { label: 'Preferir quedarte de pie', next: 'conversacion', locked: false }
        ]
      },
      silencio: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Caminan juntos por el pasillo. El silencio dice más que cualquier palabra. Victoria te mira de reojo, evaluándote.',
        choices: [
          { label: 'Romper el silencio', next: 'conversacion', locked: false },
          { label: 'Disfrutar el momento callado', next: 'conversacion', locked: false }
        ]
      },
      conversacion: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Hablan durante un rato de cosas simples, pero cada palabra que dice parece tener un doble sentido. Se acerca un poco más de lo esperado.',
        choices: [
          { label: 'Sostenerle la mirada', next: 'tension', locked: false },
          { label: 'Desviar la mirada, nervioso', next: 'tension', locked: false }
        ]
      },
      tension: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: '"Hay algo que quiero mostrarte", dice Victoria, bajando la voz. Se levanta y te tiende la mano, invitándote a seguirla a un lugar más privado.',
        choices: [
          { label: 'Tomar su mano', next: 'umbral', locked: false },
          { label: 'Preguntar qué es antes de ir', next: 'umbral', locked: false }
        ]
      },
      umbral: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Llegan a una puerta cerrada al final del pasillo. Victoria se detiene, te mira fijo, y espera tu decisión.',
        choices: [
          { label: 'Abrir la puerta', next: 'secreto_bloqueado', locked: true, cost: 30, reason: 'juego_decision' },
          { label: 'Decir que no estás listo', next: 'despedida', locked: false }
        ]
      },
      secreto_bloqueado: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Victoria te cuenta su secreto mejor guardado, acercándose cada vez más. La historia continúa de una forma que no vas a olvidar.',
        choices: [
          { label: 'Continuar la historia', next: 'despues_secreto', locked: false },
          { label: 'Volver a empezar', next: 'intro', locked: false }
        ]
      },
      despues_secreto: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Lo que acaba de pasar cambió algo entre ustedes. Victoria te mira distinto ahora, como si hubiera decidido confiar en vos de verdad.',
        choices: [
          { label: 'Quedarte con ella un poco más', next: 'segundo_umbral', locked: false },
          { label: 'Volver a empezar', next: 'intro', locked: false }
        ]
      },
      segundo_umbral: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: '"Todavía hay más que no te mostré", susurra Victoria, con una sonrisa distinta a la del principio.',
        choices: [
          { label: 'Quiero verlo', next: 'segundo_secreto_bloqueado', locked: true, cost: 50, reason: 'juego_decision' },
          { label: 'Es suficiente por hoy', next: 'despedida', locked: false }
        ]
      },
      segundo_secreto_bloqueado: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Victoria comparte algo que no le mostró a nadie más. La conexión entre ustedes llega a un punto nuevo.',
        choices: [
          { label: 'Volver a empezar', next: 'intro', locked: false }
        ]
      },
      despedida: {
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: '"Como quieras", dice con una sonrisa a medias. "La próxima vez, quizás."',
        choices: [
          { label: 'Volver a empezar', next: 'intro', locked: false }
        ]
      }
    }
  }
}

export default function GamePage({ params }) {
  const router = useRouter()
  const characterId = params?.character || 'victoria'
  const story = STORIES[characterId]

  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState(null)
  const [tokens, setTokens] = useState(0)
  const [currentSceneId, setCurrentSceneId] = useState(story?.startScene)
  const [unlockedScenes, setUnlockedScenes] = useState({})
  const [pendingUnlock, setPendingUnlock] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      const user = session.user
      setSessionUser(user)

      const { data: walletData } = await supabase
        .from('wallets')
        .select('tokens')
        .eq('user_id', user.id)
        .single()
      if (walletData) setTokens(walletData.tokens)

      const { data: progress } = await supabase
        .from('game_progress')
        .select('unlocked_scene_id')
        .eq('user_id', user.id)
        .eq('character_id', characterId)

      if (progress) {
        const map = {}
        progress.forEach(p => { map[p.unlocked_scene_id] = true })
        setUnlockedScenes(map)
      }

      setLoading(false)
    }
    init()
  }, [router, characterId])

  const handleChoice = async (choice) => {
    if (choice.locked && !unlockedScenes[choice.next]) {
      if (pendingUnlock) return
      setPendingUnlock(choice.next)

      const { data: newBalance, error } = await supabase.rpc('spend_tokens', {
        amount: choice.cost,
        reason: choice.reason || 'juego_decision'
      })

      setPendingUnlock(null)

      if (error) {
        alert('Te has quedado sin tokens. Visitá la tienda para recargar.')
        router.push('/tienda')
        return
      }

      setTokens(newBalance)

      await supabase.from('game_progress').insert({
        user_id: sessionUser.id,
        character_id: characterId,
        unlocked_scene_id: choice.next
      })

      setUnlockedScenes(prev => ({ ...prev, [choice.next]: true }))
    }

    setCurrentSceneId(choice.next)
  }

  if (loading) {
    return <div className="bg-gray-950 h-screen w-screen" />
  }

  if (!story) {
    return (
      <div className="bg-gray-950 h-screen text-white flex flex-col items-center justify-center gap-4">
        <p>Este personaje todavía no tiene una historia disponible.</p>
        <Link href="/" className="bg-amber-600 px-4 py-2 rounded-xl text-sm font-bold">Volver al inicio</Link>
      </div>
    )
  }

  const scene = story.scenes[currentSceneId]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <Link href="/" className="text-gray-400 hover:text-white text-sm font-semibold">← Volver</Link>
        <h1 className="text-sm font-bold text-amber-400">Historia de {story.name}</h1>
        <span className="text-xs text-gray-300">💎 <strong className="text-amber-400">{tokens}</strong></span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-72">
            <img src={scene.image} alt={story.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
          </div>

          <div className="p-6">
            <p className="text-gray-200 text-sm leading-relaxed mb-6">{scene.text}</p>

            <div className="flex flex-col gap-2.5">
              {scene.choices.map((choice, i) => {
                const isLockedAndNotUnlocked = choice.locked && !unlockedScenes[choice.next]
                return (
                  <button
                    key={i}
                    onClick={() => handleChoice(choice)}
                    disabled={pendingUnlock === choice.next}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                      isLockedAndNotUnlocked
                        ? 'bg-gradient-to-r from-amber-600/20 to-rose-600/20 border border-amber-500/40 text-amber-300 hover:from-amber-600/30 hover:to-rose-600/30'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {isLockedAndNotUnlocked ? `🔒 ${choice.label} (${choice.cost} tokens)` : choice.label}
                    {pendingUnlock === choice.next && ' — Desbloqueando...'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
