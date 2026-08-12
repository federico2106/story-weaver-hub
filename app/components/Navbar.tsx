'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Título */}
        <Link href="/" className="font-bold text-lg tracking-wider text-neutral-100">
          STORY WEAVER <span className="text-pink-500">HUB</span>
        </Link>

        {/* Enlaces de navegación */}
        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          <Link href="/tienda" className="hover:text-white transition">Tienda</Link>
          <Link href="/relatos" className="hover:text-white transition">Relatos</Link>
        </div>

        {/* Botón de Ingresar / Cuenta */}
        <div>
          <button className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-100 text-sm px-4 py-2 rounded transition font-medium">
            Ingresar
          </button>
        </div>
      </div>
    </nav>
  );
}