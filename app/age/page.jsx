'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgeVerificationPage() {
  const router = useRouter()

  const handleAccept = () => {
    localStorage.setItem('is_adult', 'true')
    router.push('/')
  }

  const handleReject = () => {
    alert('Debes ser mayor de 18 años para ingresar a la plataforma.')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-md text-center shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Verificación de Edad</h1>
        <p className="text-gray-400 mb-6">
          Este sitio contiene contenido exclusivo para mayores de 18 años. ¿Confirmas que eres mayor de edad?
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleAccept}
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Sí, soy mayor
          </button>
          <button 
            onClick={handleReject}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}