'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 1. Opciones visuales para Color de Pelo con fotos y tonos de color reales
const hairOptions = [
  { id: 'rubio', label: 'Rubio Radiante', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', colorDot: '#FDE047' },
  { id: 'castano', label: 'Castaño Cálido', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', colorDot: '#92400E' },
  { id: 'rojizo', label: 'Pelirrojo Fuego', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', colorDot: '#DC2626' },
  { id: 'negro', label: 'Negro Profundo', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', colorDot: '#111827' },
  { id: 'fantasia', label: 'Rosa / Fantasía', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80', colorDot: '#EC4899' },
]

// 2. Opciones visuales para Color de Ojos
const eyeOptions = [
  { id: 'azules', label: 'Azules Intensos', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', colorDot: '#3B82F6' },
  { id: 'verdes', label: 'Verdes Esmeralda', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80', colorDot: '#10B981' },
  { id: 'marrones', label: 'Marrones Claros', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', colorDot: '#B45309' },
  { id: 'miel', label: 'Miel / Ámbar', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80', colorDot: '#F59E0B' },
]

// 3. Opciones visuales para Tipo de Cuerpo
const bodyTypeOptions = [
  { id: 'curvy', label: 'Curvas Pronunciadas', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'slim', label: 'Delgada / Estilizada', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'athletic', label: 'Atlética / Fitness', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { id: 'voluptuous', label: 'Voluptuosa', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' }
]

// 4. Opciones visuales para Busto
const bustSizeOptions = [
  { id: 'small', label: 'Pequeños y sutiles', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' },
  { id: 'medium', label: 'Medianos / Naturales', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80' },
  { id: 'large', label: 'Grandes y prominentes', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' }
]

// 5. Opciones visuales para Personalidad
const personalityOptions = [
  { id: 'seductora', label: 'Seductora y Extrovertida', desc: 'Fuego puro, directa y sin filtros.', icon: '🔥' },
  { id: 'timida', label: 'Tímida y Dulce', desc: 'Tierna, atenta y muy cariñosa.', icon: '🥺' },
  { id: 'misteriosa', label: 'Misteriosa y Dominante', desc: 'Elegante, controladora y con secretos.', icon: '🖤' },
  { id: 'aventurera', label: 'Divertida y Aventurera', desc: 'Amante de los planes locos y risas.', icon: '✨' },
]

export default function CrearPersonajePage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Femenino')
  
  // Estados interactivos visuales seleccionados por defecto
  const [selectedHair, setSelectedHair] = useState('rubio')
  const [selectedEyes, setSelectedEyes] = useState('azules')
  const [selectedBodyType, setSelectedBodyType] = useState('curvy')
  const [selectedBustSize, setSelectedBustSize] = useState('large')
  const [selectedPersonality, setSelectedPersonality] = useState('seductora')
  
  const [lore, setLore] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para tu personaje.')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    const activeUser = session ? (session.user.email || session.user.id) : 'linarifederico'

    const newCharId = name.toLowerCase().replace(/\s+/g, '-')
    
    // Tomamos la foto de referencia según el cuerpo elegido
    const chosenImageObj = bodyTypeOptions.find(b => b.id === selectedBodyType) || bodyTypeOptions[0]
    const hairObj = hairOptions.find(h => h.id === selectedHair)
    const persObj = personalityOptions.find(p => p.id === selectedPersonality)

    const newCharacter = {
      id: newCharId,
      name: name.trim(),
      subtitle: `${hairObj?.label || 'Estilo único'}, ${persObj?.label.split(' ')[0] || ''}`,
      image: chosenImageObj.image,
      description: `${persObj?.desc}. Pelo ${selectedHair}, ojos ${selectedEyes}. Cuerpo: ${selectedBodyType}, Busto: ${selectedBustSize}. ${lore}`
    }

    const storageKey = `custom_chars_${activeUser}`
    const existingCustom = localStorage.getItem(storageKey)
    let parsedList = []
    
    if (existingCustom) {
      try {
        parsedList = JSON.parse(existingCustom)
      } catch (err) {}
    }

    parsedList.push(newCharacter)
    localStorage.setItem(storageKey, JSON.stringify(parsedList))

    alert(`¡Personaje "${name}" creado con éxito! Ya puedes chatear.`)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4 md:p-10">
      <div className="max-w-4xl w-full bg-gray-900/90 border border-gray-800 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-amber-400">Estudio de Creación Interactiva 🎨</h1>
            <p className="text-sm text-gray-400 mt-1">Elige visualmente cada rasgo tocando las tarjetas para moldear tu compañera o compañero perfecto.</p>
          </div>
          <Link href="/" className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-4 py-2.5 rounded-xl transition-all">
            ✕ Cancelar
          </Link>
        </div>

        <form onSubmit={handleCreate} className="space-y-10">
          
          {/* 1. Nombre y Género */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-950/50 p-6 rounded-2xl border border-gray-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                1. Nombre del Personaje
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Samantha, Victoria, Liam..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                2. Género
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Femenino', 'Masculino'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      gender === g 
                        ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. COLOR DE PELO (VISUAL E INTERACTIVO) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
              3. Color y Estilo de Pelo (Elige visualmente)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {hairOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedHair(item.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    selectedHair === item.id 
                      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' 
                      : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                  }`}
                >
                  <img src={item.image} alt={item.label} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex items-end p-2.5 justify-between">
                    <span className="text-[11px] font-bold text-white leading-tight">{item.label}</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-white/80 shadow" style={{ backgroundColor: item.colorDot }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. COLOR DE OJOS (VISUAL E INTERACTIVO) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
              4. Color de Ojos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {eyeOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEyes(item.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    selectedEyes === item.id 
                      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' 
                      : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                  }`}
                >
                  <img src={item.image} alt={item.label} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex items-end p-2.5 justify-between">
                    <span className="text-[11px] font-bold text-white">{item.label}</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-white/80 shadow" style={{ backgroundColor: item.colorDot }}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. TIPO DE CUERPO (VISUAL E INTERACTIVO) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
              5. Tipo de Cuerpo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bodyTypeOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedBodyType(item.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    selectedBodyType === item.id 
                      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' 
                      : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                  }`}
                >
                  <img src={item.image} alt={item.label} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white leading-tight">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. ATRIBUTO DE BUSTO (VISUAL E INTERACTIVO) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
              6. Atributo Físico - Busto
            </label>
            <div className="grid grid-cols-3 gap-3">
              {bustSizeOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedBustSize(item.id)}
                  className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    selectedBustSize === item.id 
                      ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' 
                      : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                  }`}
                >
                  <img src={item.image} alt={item.label} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. PERSONALIDAD (VISUAL E INTERACTIVO) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
              7. Personalidad y Actitud
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personalityOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPersonality(item.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    selectedPersonality === item.id 
                      ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-gray-950 border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-700'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. DETALLES EXTRA / LORE */}
          <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
              8. Historia o Secretos Adicionales (Opcional)
            </label>
            <textarea
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Ej: Le gusta la noche, es muy directa, usa frases atrevidas..."
              rows={3}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Botón de Guardado */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold py-4 rounded-2xl shadow-2xl transition-all cursor-pointer text-sm tracking-wider uppercase"
          >
            ✨ Guardar Todo y Empezar a Chatear
          </button>
        </form>
      </div>
    </div>
  )
}