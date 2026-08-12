import Link from 'next/link';

export default function TiendaPage() {
  const productos = [
    {
      id: 'pack-inicio',
      title: 'Pack Iniciación',
      tokens: '500 Tokens / Créditos',
      price: '$4.99 USD',
      description: 'Ideal para mantener conversaciones fluidas durante varias semanas.',
      badge: 'Popular',
    },
    {
      id: 'pase-ilimitado',
      title: 'Pase Ilimitado Mensual',
      tokens: 'Mensajes Ilimitados',
      price: '$14.99 USD',
      description: 'Acceso total y sin restricciones a todos los personajes y relatos del Hub.',
      badge: '✨ Destacado',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar Simple */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-50 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-extrabold tracking-wider text-lg text-white">
            STORY WEAVER HUB
          </Link>
          <Link href="/" className="bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Contenido de la Tienda */}
      <main className="p-8 max-w-5xl mx-auto pt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Tienda del Hub</h1>
          <p className="text-neutral-400">Potencia tus experiencias narrativas y desbloquea más tiempo de conexión.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-neutral-900/60 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-between hover:border-neutral-700 transition-colors relative">
              <span className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                {prod.badge}
              </span>
              
              <div>
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider block mb-2">{prod.tokens}</span>
                <h2 className="text-3xl font-bold mb-4">{prod.title}</h2>
                <p className="text-neutral-400 text-sm mb-6">{prod.description}</p>
              </div>

              <div>
                <div className="text-3xl font-extrabold mb-6 text-white">{prod.price}</div>
                <button className="w-full bg-white text-neutral-950 py-3 rounded-full font-semibold text-sm hover:bg-neutral-200 transition-colors">
                  Obtener ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}