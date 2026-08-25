'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

 const handleLogout = async () => {
    // Limpiamos los chats guardados al cerrar sesión
    localStorage.removeItem('chat_messages_elena');
    localStorage.removeItem('chat_messages_samantha');
    
    await supabase.auth.signOut();
  }

  return (
    <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-extrabold tracking-wider text-lg text-white">
            STORY WEAVER{' '}
            <span className="text-xs font-bold text-pink-500 tracking-widest ml-1 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
              HUB
            </span>
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm text-neutral-400 font-medium">
            <Link href="/" className="text-white hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/tienda" className="hover:text-white transition-colors">
              Tienda
            </Link>
            <Link href="/relatos" className="hover:text-white transition-colors">
              Relatos
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-24 h-9 rounded-full bg-neutral-900 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center font-bold text-xs">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-neutral-200 hidden sm:inline">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
