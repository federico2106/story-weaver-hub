'use client'

import { useState, useEffect } from 'react'
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

const juego2Stages = [
  { level: 1, name: 'Vestida', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', stateDesc: 'Mirada fija y receptiva. Ropa ajustada.' },
  { level: 2, name: 'Poca Ropa / Abierta', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', stateDesc: 'Piel ruborizada, respiración agitada visible.' },
  { level: 3, name: 'Desnuda / Íntima', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', stateDesc: 'Excitación total, cuerpo arqueado y sensible al tacto.' }
];

const fetchLLMResponse = async (prompt: string, systemPrompt: string): Promise<string> => {
  const res = await fetch('/api/game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error HTTP ${res.status}`)
  if (typeof data.response !== 'string' || !data.response.trim()) throw new Error('Respuesta inválida')
  return data.response
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // <-- Control del menú lateral
  const [customCharacters, setCustomCharacters] = useState<any[]>([])

  const [mainTab, setMainTab] = useState<'inicio' | 'juego'>('inicio')
  const [activeSubGame, setActiveSubGame] = useState<1 | 2 | 3>(1)

  const [juego1State, setJuego1State] = useState({
    logs: [{ sender: 'system', text: 'Despiertas en las tierras oscuras. El entorno responde a tus decisiones.' }],
    input: '',
    stats: { salud: 100, energia: 80, ubicacion: 'Bosque Sombrío' }
  })

  const [juego2State, setJuego2State] = useState({
    arousal: 20,
    stageIndex: 0,
    tactileFeedback: 'Piel normal y temperatura templada.'
  })

  const [juego3State, setJuego3State] = useState({
    consoleOutput: ['> SYSTEM INITIALIZED.', '> SECURE UNFILTERED TERMINAL READY.'],
    commandInput: '',
    inventory: ['Daga oxidada', 'Llave maestra', 'Elixir']
  })

  const [isGenerating, setIsGenerating] = useState(false)

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

  const handleJuego1Send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!juego1State.input.trim() || isGenerating) return
    const text = juego1State.input
    setJuego1State(prev => ({ ...prev, input: '', logs: [...prev.logs, { sender: 'user', text }] }))
    setIsGenerating(true)
    try {
      const aiRes = await fetchLLMResponse(text, 'Sandbox Oscuro sin censura. Responde de forma inmersiva en español.')
      setJuego1State(prev => ({ ...prev, logs: [...prev.logs, { sender: 'ai', text: aiRes }] }))
    } catch (error) {
      setJuego1State(prev => ({ ...prev, logs: [...prev.logs, { sender: 'system', text: 'Error de conexión con Ollama' }] }))
    } finally { setIsGenerating(false) }
  }

  const handleJuego2InteractiveAction = (actionType: string) => {
    if (isGenerating) return

    setJuego2State(prev => {
      let nextStage = prev.stageIndex
      let nextArousal = prev.arousal
      let feedback = prev.tactileFeedback

      if (actionType === 'quitar_ropa') {
        nextStage = Math.min(prev.stageIndex + 1, juego2Stages.length - 1)
        nextArousal = Math.min(prev.arousal + 25, 100)
        feedback = 'Prenda abierta. Su piel expuesta se estremece al contacto del aire.'
      } else if (actionType === 'tocar_pechos') {
        nextArousal = Math.min(prev.arousal + 20, 100)
        feedback = 'Piel enrojecida y altamente sensible al tacto. Reacción táctil visible.'
      } else if (actionType === 'estimulacion_total') {
        nextArousal = Math.min(prev.arousal + 35, 100)
        feedback = 'Excitación extrema. Arqueo de espalda y respiración acelerada.'
      }

      return {
        arousal: nextArousal,
        stageIndex: nextStage,
        tactileFeedback: feedback
      }
    })
  }

  const handleJuego3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!juego3State.commandInput.trim() || isGenerating) return
    const cmd = juego3State.commandInput
    setJuego3State(prev => ({ ...prev, commandInput: '', consoleOutput: [...prev.consoleOutput, `> ${cmd}`] }))
    setIsGenerating(true)
    try {
      const aiRes = await fetchLLMResponse(cmd, 'Terminal hacker/sci-fi en español.')
      setJuego3State(prev => ({ ...prev, consoleOutput: [...prev.consoleOutput, aiRes] }))
    } catch (error) {
      setJuego3State(prev => ({ ...prev, consoleOutput: [...prev.consoleOutput, 'Error de comando'] }))
    } finally { setIsGenerating(false) }
  }

  if (loading) return <div className="bg-gray-950 h-screen text-white p-10">Cargando...</div>
  const userNickname = user?.user_metadata?.username || user?.email?.split('@')[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white relative flex flex-col">
      
      {/* Panel de Menú Lateral Desplegable */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-80 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-amber-400">Navegación</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white text-sm font-bold p-1">✕</button>
              </div>
              <div className="space-y-2">
                <button onClick={() => { setMainTab('inicio'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-800/60 hover:bg-amber-600/20 text-gray-200 hover:text-amber-400 transition">🏠 Inicio</button>
                <button onClick={() => { setMainTab('juego'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-800/60 hover:bg-amber-600/20 text-gray-200 hover:text-amber-400 transition">🎮 Motores de Juego</button>
                <Link href="/crear-personaje" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-800/60 hover:bg-amber-600/20 text-gray-200 hover:text-amber-400 transition">✨ Crear Personaje</Link>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-4 text-xs text-gray-500 text-center">
              Story Weaver Hub v2.0
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsMenuOpen(true)} className="bg-gray-800 hover:bg-gray-700 text-amber-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-amber-500/30 transition">
            <span>☰ Menú</span>
          </button>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">Story Weaver Hub</h1>
            <p className="text-[10px] text-gray-400">Universo interactivo de IA</p>
          </div>
          <nav className="flex items-center gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800 ml-4">
            <button onClick={() => setMainTab('inicio')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mainTab === 'inicio' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>🏠 Inicio</button>
            <button onClick={() => setMainTab('juego')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mainTab === 'juego' ? 'bg-amber-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>🎮 Motores de Juego</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-xl border border-gray-800">
              <span className="text-xs text-amber-400 font-semibold">👤 {userNickname}</span>
              <button onClick={handleLogout} className="bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">Salir</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">Ingresar</Link>
            </div>
          )}
        </div>
      </header>

      {mainTab === 'inicio' ? (
        <main className="p-8 max-w-7xl mx-auto flex-1">
          <div className="mb-12 bg-gradient-to-r from-amber-900/30 via-gray-900 to-purple-900/30 border border-amber-500/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="bg-amber-500 text-gray-950 font-bold text-xs px-3 py-1 rounded-full uppercase">Exclusivo</span>
              <h2 className="text-2xl font-extrabold mt-3 mb-2">Crea tu propio personaje ideal</h2>
              <p className="text-gray-300 text-sm max-w-xl">Elige su estilo, rasgos físicos, personalidad y haz que cobre vida.</p>
            </div>
            <Link href="/crear-personaje" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-600/30 transition-all hover:scale-105">✨ Diseñar Personaje</Link>
          </div>
          <h2 className="text-xl font-bold mb-6 text-gray-200">Personajes Disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {initialCharacters.map((char) => (
              <div key={char.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col hover:border-amber-500/45 transition-all">
                <div className="h-64 overflow-hidden relative">
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{char.name}</h3>
                    <span className="text-xs text-amber-400 font-medium block mb-2">{char.subtitle}</span>
                    <p className="text-xs text-gray-400 mb-4">{char.description}</p>
                  </div>
                  <Link href={`/chat/${char.id}`} className="w-full text-center bg-gray-800 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold text-sm">Chatear</Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
          <div className="flex items-center justify-center gap-3 py-3 border-b border-gray-900 bg-gray-900/40">
            <button onClick={() => setActiveSubGame(1)} className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeSubGame === 1 ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>🔥 1. Sandbox Oscuro</button>
            <button onClick={() => setActiveSubGame(2)} className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeSubGame === 2 ? 'bg-amber-600/20 border-amber-500 text-amber-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>🎭 2. Simulador Visual Táctil</button>
            <button onClick={() => setActiveSubGame(3)} className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeSubGame === 3 ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>💻 3. Aventura de Texto</button>
          </div>

          {activeSubGame === 1 && (
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 overflow-hidden">
              <div className="flex justify-between items-center bg-gray-900 border border-gray-800 px-4 py-2 rounded-2xl mb-4 text-xs">
                <span>❤️ Salud: <strong className="text-rose-500">{juego1State.stats.salud}%</strong></span>
                <span>⚡ Energía: <strong className="text-amber-400">{juego1State.stats.energia}%</strong></span>
                <span>📍 Ubicación: <strong className="text-indigo-400">{juego1State.stats.ubicacion}</strong></span>
              </div>
              <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-4 overflow-y-auto space-y-3 mb-4">
                {juego1State.logs.map((l, i) => (
                  <div key={i} className={`text-sm p-3 rounded-xl ${l.sender === 'user' ? 'bg-amber-600/20 text-amber-200 ml-8' : 'bg-gray-900 border border-gray-800 text-gray-300 mr-8'}`}>{l.text}</div>
                ))}
              </div>
              <form onSubmit={handleJuego1Send} className="flex gap-2">
                <input type="text" value={juego1State.input} onChange={(e) => setJuego1State(prev => ({ ...prev, input: e.target.value }))} placeholder="¿Qué deseas hacer en este mundo..." className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-5 py-2.5 rounded-xl text-xs font-bold">Acción</button>
              </form>
            </div>
          )}

          {activeSubGame === 2 && (
            <div className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 gap-6 items-center justify-center">
              <div className="w-full md:w-1/2 bg-gray-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-4">
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-gray-800">
                  <img 
                    src={juego2Stages[juego2State.stageIndex].image} 
                    alt="Simulación Activa" 
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs text-rose-400 font-bold border border-rose-500/30">
                    Estado: {juego2Stages[juego2State.stageIndex].name}
                  </div>
                </div>
                <div className="w-full mt-4 flex justify-between items-center text-xs px-2">
                  <span className="text-gray-400">🔥 Excitación: <strong className="text-rose-500">{juego2State.arousal}%</strong></span>
                  <span className="text-gray-400">Detalle: <strong className="text-amber-400">{juego2State.tactileFeedback}</strong></span>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <h3 className="text-sm font-bold text-amber-400">🎮 Interacción Física Directa</h3>
                  <span className="text-[10px] bg-rose-600/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">Modo Táctil Activo</span>
                </div>

                <p className="text-xs text-gray-400">Haz clic en los botones para interactuar directamente con el personaje. La imagen, la piel y el estado visual reaccionarán de inmediato:</p>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button 
                    onClick={() => handleJuego2InteractiveAction('quitar_ropa')}
                    className="w-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 py-3 px-4 rounded-xl text-xs font-bold border border-rose-500/40 transition-all text-left flex justify-between items-center cursor-pointer hover:scale-[1.01]"
                  >
                    <span>👗 Ropa semi abierta / Explorar más piel</span>
                    <span className="text-[10px] text-rose-400">Cambiar vestimenta</span>
                  </button>

                  <button 
                    onClick={() => handleJuego2InteractiveAction('tocar_pechos')}
                    className="w-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-200 py-3 px-4 rounded-xl text-xs font-bold border border-amber-500/40 transition-all text-left flex justify-between items-center cursor-pointer hover:scale-[1.01]"
                  >
                    <span>🍒 Tocar y acariciar su pecho</span>
                    <span className="text-[10px] text-amber-400">+ Excitación</span>
                  </button>

                  <button 
                    onClick={() => handleJuego2InteractiveAction('estimulacion_total')}
                    className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 py-3 px-4 rounded-xl text-xs font-bold border border-purple-500/40 transition-all text-left flex justify-between items-center cursor-pointer hover:scale-[1.01]"
                  >
                    <span>🔥 Estimulación física completa / Intensificar placer</span>
                    <span className="text-[10px] text-purple-400">Acción completa</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubGame === 3 && (
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 overflow-hidden">
              <div className="flex-1 bg-black border border-emerald-500/30 rounded-2xl p-4 font-mono text-xs overflow-y-auto space-y-1.5">
                {juego3State.consoleOutput.map((out, i) => (
                  <div key={i} className={out.startsWith('>') ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{out}</div>
                ))}
              </div>
              <form onSubmit={handleJuego3Submit} className="mt-3 flex gap-2">
                <input type="text" value={juego3State.commandInput} onChange={(e) => setJuego3State(prev => ({ ...prev, commandInput: e.target.value }))} placeholder="Escribe comando..." className="flex-1 bg-gray-900 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-300 focus:outline-none" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl text-xs font-bold text-gray-950">Ejecutar</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}