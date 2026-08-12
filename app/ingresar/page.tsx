'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IngresarPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isLogin ? '¡Sesión iniciada con éxito!' : '¡Cuenta creada correctamente!');
    router.push('/'); // Te redirige automáticamente al inicio al terminar
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between">
      {/* Navbar Simple */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-extrabold tracking-wider text-lg text-white">
            STORY WEAVER HUB
          </Link>
          <Link href="/" className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Formulario Principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </h1>
            <p className="text-neutral-400 text-sm">
              {isLogin ? 'Ingresa tus datos para continuar' : 'Completa tus datos personales para empezar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-neutral-950 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors mt-6 shadow-lg cursor-pointer"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}