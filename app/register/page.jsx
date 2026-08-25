'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Registrar usuario en Supabase guardando el apodo en los metadatos
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim() || email.split('@')[0],
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-2xl font-black mb-2 text-amber-400">Crear una cuenta</h1>
        <p className="text-gray-400 text-sm mb-6">Elige un apodo para mantener tu privacidad en la comunidad.</p>

        {error && <div className="bg-rose-500/20 border border-rose-500 text-rose-300 p-3 rounded-xl text-xs mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Apodo / Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: NightWolf"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-amber-600/30 transition-all text-sm mt-2"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-amber-400 font-semibold hover:underline">Ingresa aquí</Link>
        </p>
      </div>
    </div>
  )
}