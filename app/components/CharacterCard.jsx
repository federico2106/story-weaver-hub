// Crear como archivo nuevo: app/components/CharacterCard.jsx

'use client'

import Link from 'next/link'

// Paleta de colores para el badge de categoría, se elige según el texto del subtítulo
const CATEGORY_COLORS = [
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-sky-500 to-blue-500',
]

function getCategoryColor(subtitle) {
  let hash = 0
  for (let i = 0; i < subtitle.length; i++) {
    hash = subtitle.charCodeAt(i) + ((hash << 5) - hash)
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}

export default function CharacterCard({ character, isCustom = false, isNew = false }) {
  const categoryColor = getCategoryColor(character.subtitle)

  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">

      {/* Badge "Nuevo" opcional, arriba a la izquierda */}
      {isNew && (
        <div className="absolute top-3 left-3 z-20 bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow">
          Nuevo
        </div>
      )}

      {/* Badge "En línea" con pulso, arriba a la derecha */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-gray-950/80 backdrop-blur px-2.5 py-1 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] text-gray-300 font-medium">En línea</span>
      </div>

      {/* Imagen con overlay de info que aparece en hover */}
      <div className="h-64 overflow-hidden relative">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay con descripción, aparece al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-xs text-gray-200 leading-relaxed">{character.description}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">{character.name}</h3>
          <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryColor} text-white`}>
            {isCustom ? 'Personalizado' : character.subtitle}
          </span>
        </div>

        <Link
          href={`/chat/${character.id}`}
          className="w-full text-center bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-rose-600 text-white py-2.5 rounded-xl font-semibold transition-all text-sm"
        >
          Chatear
        </Link>
      </div>
    </div>
  )
}
