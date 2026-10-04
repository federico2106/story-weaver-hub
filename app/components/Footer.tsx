'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/register' || pathname === '/age') {
    return null
  }

  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 border-t border-gray-800 text-gray-500 text-xs py-6 px-4 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <Link href="/terminos" className="hover:text-amber-400 transition-colors">
          Términos de Uso
        </Link>
        <span className="text-gray-700">·</span>
        <Link href="/privacidad" className="hover:text-amber-400 transition-colors">
          Política de Privacidad
        </Link>
      </div>
      <p>© {year} Story Weaver Hub. Solo mayores de 18 años.</p>
    </footer>
  )
}
