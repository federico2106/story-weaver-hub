'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-extrabold tracking-wider text-lg text-white">
            STORY WEAVER HUB
          </Link>
          <Link
            href="/"
            className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Bienvenido de nuevo</h1>
            <p className="text-neutral-400 text-sm">Ingresa tus datos para continuar</p>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tucorreo@ejemplo.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-950 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors mt-6 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-neutral-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-pink-400 hover:text-pink-300 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
