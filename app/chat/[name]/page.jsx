'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

const EMOJI_LIST = ['😊', '😂', '❤️', '🔥', '😍', '😘', '🥺', '😎', '😉', '🥰', '💋', '😈', '🌹', '✨', '💎', '🎉', '👏', '🙌', '👀', '💬']

// Mensajes de bienvenida iniciales del personaje (no se persisten en la DB, son estáticos por diseño)
const getDefaultMessages = (imgUrl) => [
  {
    id: 'default-1',
    sender: 'bot',
    text: 'Hola... Qué bueno que llegaste. Estaba esperando a que te conectaras para mostrarte algo especial 💋',
    image: null
  },
  {
    id: 'default-2',
    sender: 'bot',
    text: 'Te dejo un pequeño adelanto privado. Dime qué te parece...',
    image: imgUrl,
    isLocked: true,
    price: 50
  }
]

export default function ChatPage() {
  const router = useRouter()
  const messagesEndRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState(null)

  const [tokens, setTokens] = useState(0)
  const [inputText, setInputText] = useState('')
  const [character, setCharacter] = useState(null)
  const [defaultMessages, setDefaultMessages] = useState([])
  const [historyMessages, setHistoryMessages] = useState([])
  const [unlockedIds, setUnlockedIds] = useState({}) // desbloqueo de fotos: sigue siendo local a la sesión (pendiente de persistir)
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false)
  const [ageCheckboxChecked, setAgeCheckboxChecked] = useState(false)
  const [showProfileInfo, setShowProfileInfo] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingUnlockId, setPendingUnlockId] = useState(null)

  const [isRecording, setIsRecording] = useState(false)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const checkUserAndSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const user = session.user
      setSessionUser(user)

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('tokens')
        .eq('user_id', user.id)
        .single()

      if (walletError) {
        if (walletError.code === 'PGRST116') {
          setTokens(0)
        } else {
          console.error('Error al obtener la wallet:', walletError.message)
        }
      } else if (walletData) {
        setTokens(walletData.tokens)
      }

      const { data: consentData } = await supabase
        .from('user_consents')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (consentData) {
        setIsAdultConfirmed(true)
      }

      const pathSegments = window.location.pathname.split('/')
      const characterName = pathSegments[pathSegments.length - 1]

      if (!characterName) {
        setLoading(false)
        return
      }

      const cleanId = decodeURIComponent(characterName).trim().toLowerCase()
      let found = initialCharacters.find(c => c.id.toLowerCase() === cleanId)

      if (!found) {
        const savedCustom = localStorage.getItem(`custom_chars_${user.id}`)
        if (savedCustom) {
          try {
            const customList = JSON.parse(savedCustom)
            found = customList.find(c => c.id.toLowerCase() === cleanId)
          } catch (e) {}
        }
      }

      if (found) {
        setCharacter(found)
        setDefaultMessages(getDefaultMessages(found.image))

        // Cargar historial real desde Supabase
        const { data: history, error: historyError } = await supabase
          .from('chat_messages')
          .select('id, sender, text, audio_url, created_at')
          .eq('user_id', user.id)
          .eq('character_id', found.id)
          .order('created_at', { ascending: true })

        if (historyError) {
          console.error('Error cargando historial:', historyError.message)
        } else if (history) {
          setHistoryMessages(history.map(m => ({
            id: m.id,
            sender: m.sender,
            text: m.text,
            audioUrl: m.audio_url,
            isAudio: !!m.audio_url
          })))
        }
      }

      setLoading(false)
    }

    checkUserAndSession()
  }, [router])

  const messages = [...defaultMessages, ...historyMessages]

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  const handleConfirmAdult = async () => {
    if (!sessionUser || !ageCheckboxChecked) return

    const { error } = await supabase
      .from('user_consents')
      .insert({ user_id: sessionUser.id })

    if (error && error.code !== '23505') {
      console.error('Error al registrar consentimiento:', error.message)
    }

    setIsAdultConfirmed(true)
  }

  // Descuento de tokens directo (usado para el desbloqueo de fotos, que no pasa por /api/chat)
  const spendTokensServerSide = async (amount, reason) => {
    const { data, error } = await supabase.rpc('spend_tokens', { amount, reason })

    if (error) {
      alert('Te has quedado sin tokens o ocurrió un error de saldo.')
      router.push('/tienda')
      return null
    }

    setTokens(data)
    return data
  }

  const handleSendMessage = async (e, customText = null, audioUrl = null) => {
    if (e) e.preventDefault()
    if (isSubmitting) return

    const textToSend = customText || inputText.trim()
    if (!textToSend && !audioUrl) return

    setIsSubmitting(true)

    // Mensaje optimista del usuario, mientras esperamos la respuesta del servidor
    const optimisticId = `optimistic-${Date.now()}`
    const optimisticUserMsg = {
      id: optimisticId,
      sender: 'user',
      text: audioUrl ? '' : textToSend,
      audioUrl: audioUrl,
      isAudio: !!audioUrl
    }
    setHistoryMessages(prev => [...prev, optimisticUserMsg])
    if (!customText) setInputText('')
    setShowEmojiPicker(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: audioUrl ? null : textToSend,
          characterId: character.id,
          audioUrl: audioUrl
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        // Revertir el mensaje optimista si falló (por ejemplo, sin tokens)
        setHistoryMessages(prev => prev.filter(m => m.id !== optimisticId))
        alert(data.error || 'No se pudo enviar el mensaje.')
        if (data.error?.toLowerCase().includes('token')) {
          router.push('/tienda')
        }
        return
      }

      setTokens(data.remainingTokens)

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        audioUrl: null,
        isAudio: false
      }
      setHistoryMessages(prev => [...prev, botMsg])

    } catch (err) {
      console.error('Error enviando mensaje:', err)
      setHistoryMessages(prev => prev.filter(m => m.id !== optimisticId))
      alert('Ocurrió un error de red. Intentá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddEmoji = (emoji) => {
    setInputText((prev) => prev + emoji)
  }

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        audioChunksRef.current = []

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorderRef.current.onstop = async () => {
          setIsUploadingAudio(true)
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          stream.getTracks().forEach(track => track.stop())

          const fileName = `${sessionUser.id}/${Date.now()}.webm`
          const { error: uploadError } = await supabase.storage
            .from('voice-notes')
            .upload(fileName, audioBlob)

          if (uploadError) {
            alert('No se pudo enviar la nota de voz.')
            setIsUploadingAudio(false)
            return
          }

          const { data: publicUrlData } = supabase.storage
            .from('voice-notes')
            .getPublicUrl(fileName)

          setIsUploadingAudio(false)
          handleSendMessage(null, null, publicUrlData.publicUrl)
        }

        mediaRecorderRef.current.start()
        setIsRecording(true)
        setShowEmojiPicker(false)
      } catch (err) {
        alert('No se pudo acceder al micrófono. Revisa los permisos de tu navegador.')
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    }
  }

  // Desbloqueo de fotos: descuenta tokens de forma segura, pero el estado "desbloqueada"
  // vive solo en esta sesión por ahora (pendiente: persistir en Supabase)
  const unlockContentMessage = async (messageId) => {
    if (pendingUnlockId === messageId) return
    setPendingUnlockId(messageId)

    const newBalance = await spendTokensServerSide(50, 'desbloqueo_foto')

    setPendingUnlockId(null)
    if (newBalance === null) return

    setUnlockedIds(prev => ({ ...prev, [messageId]: true }))
  }

  if (loading) {
    return <div className="bg-gray-950 h-screen w-screen" />
  }

  if (!character) {
    return (
      <div className="bg-gray-950 h-screen text-white flex flex-col items-center justify-center gap-4">
        <p>Personaje no encontrado.</p>
        <Link href="/" className="bg-amber-600 px-4 py-2 rounded-xl text-sm font-bold">Volver al inicio</Link>
      </div>
    )
  }

  const displayMessages = messages.map(m =>
    m.isLocked && unlockedIds[m.id] ? { ...m, isLocked: false } : m
  )
  const unlockedPhotos = displayMessages.filter(m => m.image && !m.isLocked)

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden relative">

      {!isAdultConfirmed && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl animate-fadeIn">
            <div className="text-4xl mb-4">🔞</div>
            <h2 className="text-xl font-bold text-amber-400 mb-2">Contenido para Adultos (+18)</h2>
            <p className="text-sm text-gray-300 mb-4">
              Este chat contiene interacciones maduras y contenido exclusivo. Debes ser mayor de 18 años para continuar.
            </p>

            <label className="flex items-start gap-2 text-left text-xs text-gray-400 mb-6 bg-gray-950/50 p-3 rounded-xl border border-gray-800">
              <input
                type="checkbox"
                checked={ageCheckboxChecked}
                onChange={(e) => setAgeCheckboxChecked(e.target.checked)}
                className="mt-0.5 cursor-pointer"
              />
              <span>
                Confirmo que soy mayor de 18 años y acepto los{' '}
                <Link href="/terminos" className="text-amber-400 underline" target="_blank">
                  Términos de Uso
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="text-amber-400 underline" target="_blank">
                  Política de Privacidad
                </Link>.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
              >
                Salir
              </button>
              <button
                onClick={handleConfirmAdult}
                disabled={!ageCheckboxChecked}
                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm shadow-lg transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm font-semibold">
            ← Volver
          </Link>

          <div
            onClick={() => setShowProfileInfo(true)}
            className="flex items-center gap-3 cursor-pointer group bg-gray-800/40 hover:bg-gray-800/80 px-3 py-1.5 rounded-2xl transition-all border border-transparent hover:border-amber-500/30"
          >
            <div className="relative">
              <img src={character.image} alt={character.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-950 rounded-full"></span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-400 capitalize group-hover:underline">{character.name}</h2>
              <span className="text-[11px] text-gray-400">En línea (Ver info)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
          <span className="text-xs text-gray-300">💎 <strong className="text-amber-400">{tokens}</strong> Tokens</span>
          <Link href="/tienda" className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
            Recargar
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col h-full border-r border-gray-900">
          <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-6 space-y-6 overflow-y-auto">
            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-md rounded-2xl p-4 text-sm ${msg.sender === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none shadow-lg'}`}>

                  {msg.isAudio ? (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs font-bold opacity-90">
                        <span>🎙️ Nota de voz</span>
                      </div>
                      <audio controls src={msg.audioUrl} className="w-full h-8 accent-white">
                        Tu navegador no soporta audios.
                      </audio>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}

                  {msg.image && (
                    <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-800 max-w-xs">
                      <img
                        src={msg.image}
                        alt="Contenido exclusivo"
                        loading="lazy"
                        className={`w-full h-56 object-cover transition-all duration-300 ${msg.isLocked ? 'blur-xl scale-105' : 'blur-0'}`}
                      />

                      {msg.isLocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-2xl mb-1">🔒</span>
                          <h4 className="text-xs font-bold text-amber-400 mb-1">Contenido Privado (+18)</h4>
                          <p className="text-[10px] text-gray-300 mb-3">Revela esta foto exclusiva.</p>

                          <button
                            onClick={() => unlockContentMessage(msg.id)}
                            disabled={pendingUnlockId === msg.id}
                            className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {pendingUnlockId === msg.id ? 'Desbloqueando...' : `Desbloquear (${msg.price || 50} tokens) 💎`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 px-1">
                  {msg.sender === 'user' ? 'Tú' : character.name}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </main>

          <footer className="flex-shrink-0 max-w-2xl w-full mx-auto p-4 bg-gray-950 relative">
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-20 left-4 bg-gray-900 border border-gray-800 rounded-2xl p-3 shadow-2xl grid grid-cols-5 gap-2 z-30 animate-fadeIn"
              >
                {EMOJI_LIST.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="w-10 h-10 hover:bg-gray-800 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center bg-gray-900 border border-gray-800 rounded-2xl px-3 py-2 shadow-lg focus-within:border-amber-500 transition-all">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Abrir selector de emojis"
                className="p-2 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer text-lg"
              >
                😊
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? "🔴 Grabando audio..." : isUploadingAudio ? "⏳ Subiendo audio..." : "Escribe un mensaje..."}
                disabled={isRecording || isUploadingAudio || isSubmitting}
                className="flex-1 bg-transparent border-none px-3 py-2 text-sm text-white focus:outline-none disabled:opacity-50"
              />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isUploadingAudio}
                  title={isRecording ? "Detener y enviar audio" : "Grabar nota de voz"}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center text-sm ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : 'text-amber-400 hover:bg-gray-800'
                  } disabled:opacity-50`}
                >
                  {isRecording ? '⏹️' : '🎤'}
                </button>

                {!isRecording && (
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingAudio}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-all text-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Enviar'}
                  </button>
                )}
              </div>
            </form>
          </footer>
        </div>

        <aside className="hidden lg:flex flex-col w-84 p-4 bg-gray-950 border-l border-gray-900 overflow-y-auto space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)] bg-gradient-to-b from-rose-950/40 via-gray-900 to-gray-900 p-3.5">
            <div className="absolute top-2.5 right-2.5 z-10 bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow animate-pulse">
              🔥 Exclusivo Hot
            </div>

            <div className="relative h-36 rounded-xl overflow-hidden mb-2.5 border border-rose-500/30">
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
                alt="Modelo exclusiva"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
            </div>

            <h3 className="text-xs font-black text-rose-300 tracking-wide">Galería Privada de Victoria</h3>
            <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">
              Desbloquea contenido sin censura y transmisiones en vivo directo al chat.
            </p>

            <Link
              href="/tienda"
              className="mt-3 block text-center bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition-all"
            >
              Ver Galería VIP 🔓
            </Link>
          </div>

          <div className="relative bg-gradient-to-br from-amber-500/20 via-amber-950/30 to-gray-900 border border-amber-500/50 rounded-2xl p-3.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] text-center">
            <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-amber-500 text-gray-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
              ⚡ Oferta Limitada
            </div>

            <div className="text-2xl mt-1.5 mb-0.5">💎</div>
            <h3 className="text-xs font-extrabold text-amber-300">¡Pack x2 de Tokens!</h3>
            <p className="text-[10px] text-gray-300 mt-0.5">
              Obtén el doble de gemas ahora mismo para no quedarte sin mensajes ni fotos.
            </p>
            <Link
              href="/tienda"
              className="mt-2.5 block bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold py-2 rounded-xl text-xs shadow-lg transition-all"
            >
              Recargar Ya 🚀
            </Link>
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3 text-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
              Membresía Global
            </span>
            <p className="text-[10px] text-gray-300 font-medium mt-1">
              ✨ Acceso ilimitado a todas las modelos y personajes sin demoras ni esperas.
            </p>
          </div>
        </aside>
      </div>

      {showProfileInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/40">
              <h3 className="text-sm font-bold text-amber-400">Información del Contacto</h3>
              <button
                onClick={() => setShowProfileInfo(false)}
                className="text-gray-400 hover:text-white text-lg font-bold px-2 py-0.5 rounded-lg bg-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col items-center text-center">
                <img src={character.image} alt={character.name} className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-lg mb-3" />
                <h2 className="text-lg font-extrabold text-white capitalize">{character.name}</h2>
                <span className="text-xs text-amber-400 font-medium mt-0.5">{character.subtitle}</span>
                <p className="text-xs text-gray-300 mt-2 bg-gray-950/60 p-3 rounded-2xl border border-gray-800 w-full">
                  "{character.description}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                  <span>📸 Archivos y Fotos Desbloqueadas</span>
                  <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px]">
                    {unlockedPhotos.length}
                  </span>
                </h4>

                {unlockedPhotos.length === 0 ? (
                  <div className="text-center py-6 bg-gray-950/40 rounded-2xl border border-gray-800/60">
                    <p className="text-xs text-gray-500">Aún no hay fotos desbloqueadas en este chat.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {unlockedPhotos.map((photoItem) => (
                      <div key={photoItem.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-800 group">
                        <img src={photoItem.image} alt="Foto compartida" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-950/40 text-center">
              <button
                onClick={() => setShowProfileInfo(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}