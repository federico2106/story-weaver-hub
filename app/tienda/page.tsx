export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 max-w-5xl mx-auto">
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-2xl font-bold tracking-wider">TIENDA</h1>
        <p className="text-sm text-neutral-400 mt-1">Adquiere créditos para continuar las historias y desbloquear interacciones exclusivas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paquete 1 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-200">Pack Inicial</h3>
            <p className="text-3xl font-extrabold mt-4 text-white">$4.99</p>
            <p className="text-sm text-neutral-400 mt-2">100 créditos para mensajes y relatos interactivos.</p>
          </div>
          <button className="mt-6 w-full bg-neutral-800 hover:bg-neutral-700 py-2 rounded font-medium text-sm transition">
            Comprar Pack
          </button>
        </div>

        {/* Paquete 2 */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 flex flex-col justify-between relative shadow-lg">
          <span className="absolute -top-3 right-4 bg-pink-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Popular</span>
          <div>
            <h3 className="font-bold text-lg text-neutral-200">Pack Pro</h3>
            <p className="text-3xl font-extrabold mt-4 text-white">$9.99</p>
            <p className="text-sm text-neutral-400 mt-2">250 créditos + acceso anticipado a capítulos de audio.</p>
          </div>
          <button className="mt-6 w-full bg-white text-neutral-950 hover:bg-neutral-200 py-2 rounded font-medium text-sm transition">
            Comprar Pack
          </button>
        </div>

        {/* Paquete 3 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-200">Pase Ilimitado</h3>
            <p className="text-3xl font-extrabold mt-4 text-white">$19.99</p>
            <p className="text-sm text-neutral-400 mt-2">Mensajes ilimitados por 30 días con todos los personajes.</p>
          </div>
          <button className="mt-6 w-full bg-neutral-800 hover:bg-neutral-700 py-2 rounded font-medium text-sm transition">
            Obtener Pase
          </button>
        </div>
      </div>
    </div>
  );
}