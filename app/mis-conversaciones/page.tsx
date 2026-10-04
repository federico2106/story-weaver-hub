'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const initialCharacters = [
  { id: 'samantha', name: 'Samantha', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  { id: 'elena', name: 'Elena', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80' },
  { id: 'akane', name: 'Akane', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80' },
  { id: 'victoria', name: 'Victoria', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80' },
  { id: 'valentina', name: 'Valentina', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80' },
  { id: 'chloe', name: 'Chloe', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80' },
  { id: 'mia', name: 'Mia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80' },
  { id: 'sophia', name: 'Sophia', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
  { id: 'yuki', name: 'Yuki', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80' },
  { id: 'isabella', name: 'Isabella', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80' },
  { id: 'luna', name: 'Luna', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  { id: 'camila', name: 'Camila', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80' },
  { id: 'scarlett', name: 'Scarlett', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80' },
  { id: 'mei', name: 'Mei', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80' },
  { id: 'ariana', name: 'Ariana', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80' },
  { id: 'claudia', name: 'Claudia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80' },
  { id: 'liam', name: 'Liam', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
  { id: 'dante', name: 'Dante', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80' },
  { id: 'hiro', name: 'Hiro', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80' }
]

function buildSnippet(msg: { text: string | null; sender: string; audio_url: string | null }) {
  const body = msg.text
    ? (msg.text.length > 60 ? msg.text.slice(0, 60) + '…' : msg.text)
    : msg.audio_url
      ? '🎙️ Nota de voz'
      : '...'
  return msg.sender === 'user' ? `Vos: ${body}` : body
}

export default function MisConversacionesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const { data: messages } = await supabase
        .from('chat_messages')
        .select('character_id, text, sender, audio_url, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!messages || messages.length === 0) {
        setLoading(false)
        return
      }

      const { data: customChars } = await supabase
        .from('custom_characters')
        .select('slug, name, image_url')
        .eq('user_id', session.user.id)

      const customMap = new Map((customChars || []).map(c => [c.slug, c]))

      const seen = new Set<string>()
      const list: any[] = []

      for (const msg of messages) {
        if (seen.has(msg.character_id)) continue
        seen.add(msg.character_id)

        const staticChar = initialCharacters.find(c => c.id === msg.character_id)
        const customChar = customMap.get(msg.character_id)

        list.push({
          characterId: msg.character_id,
          name: staticChar?.name || customChar?.name || msg.character_id,
          image: staticChar?.image || customChar?.image_url || null,
          snippet: buildSnippet(msg),
          lastAt: msg.created_at
        })
      }

      setConversations(list)
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-200">💬 Mis Chats</h1>

      {conversations.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-sm text-gray-400 mb-4">Todavía no tenés ninguna conversación.</p>
          <Link
            href="/"
            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm"
          >
            🏠 Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {conversations.map((conv) => (
            <Link
              key={conv.characterId}
              href={`/chat/${conv.characterId}`}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-amber-500/45 rounded-2xl p-4 transition-all"
            >
              {conv.image ? (
                <img src={conv.image} alt={conv.name} className="w-12 h-12 rounded-full object-cover border border-amber-500/40 shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-800 border border-amber-500/40 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold capitalize truncate">{conv.name}</h3>
                <p className="text-xs text-gray-400 truncate">{conv.snippet}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
