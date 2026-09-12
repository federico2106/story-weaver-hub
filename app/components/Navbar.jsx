'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('wallets')
          .select('tokens')
          .eq('user_id', user.id)
          .single()
        if (data) setTokens(data.tokens)
      }
    }
    load()
  }, [pathname])

  // Botón de scroll-to-top: aparece después de bajar 300px
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (pathname === '/login' || pathname === '/register' || pathname === '/age') {
    return null
  }

  return (
    <>
      {/* Barra superior: siempre visible, sin condiciones de ancho de pantalla */}
      <nav className="sticky top-0 z-50 bg-gray-950 border-b-2 border-amber-500/40 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-gray-900 border border-amber-500/40 text-amber-400 px-3 py-2 rounded-xl text-sm font-bold"
          >
            ☰ Menú
          </button>

          <Link href="/" className="text-base font-black bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
            Story Weaver Hub
          </Link>

          <div className="flex items-center gap-2">
            {user && (
              <span className="text-xs font-medium text-gray-300 hidden sm:inline">
                {user.email?.split('@')[0]}
              </span>
            )}
            {user && tokens !== null && (
              <Link
                href="/tienda"
                className="text-xs font-bold text-amber-400 bg-gray-900 border border-gray-700 hover:border-amber-500 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                💎 {tokens}
              </Link>
            )}
            {!user && (
              <Link href="/login" className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay para cerrar el menú al hacer click afuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Panel del menú desplegable, agrupado por secciones */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-gray-800 z-50 overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <span className="font-black text-amber-400">Menú</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 text-xl">✕</button>
          </div>

          <div className="px-3 py-4 space-y-4">

            <div>
              <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Explorar</div>
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>🏠</span> Inicio
              </Link>
              <Link href="/comunidad" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>🌐</span> Comunidad
              </Link>
              <Link href="/relatos" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>📖</span> Relatos
              </Link>
              <Link href="/historias" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>🎬</span> Historias / Videos
              </Link>
              <Link href="/game/victoria" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>🎮</span> Juegos
              </Link>
            </div>

            <div>
              <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Tu actividad</div>
              <Link href="/mis-conversaciones" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>💬</span> Mis Chats
              </Link>
              <Link href="/mis-personajes" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>👤</span> Mis Creaciones
              </Link>
              <Link href="/crear-personaje" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>✨</span> Crear Personaje
              </Link>
            </div>

            <div>
              <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Cuenta</div>
              <Link href="/tienda" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900">
                <span>🛒</span> Tokens / Tienda
              </Link>
              {user ? (
                <button
                  onClick={() => { setIsMenuOpen(false); handleLogout() }}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-900"
                >
                  <span>🚪</span> Salir
                </button>
              ) : (
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-400 hover:bg-gray-900">
                  <span>📝</span> Registrarse
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de scroll-to-top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-amber-600 hover:bg-amber-500 text-white w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-lg font-bold"
        >
          ↑
        </button>
      )}
    </>
  )
}
