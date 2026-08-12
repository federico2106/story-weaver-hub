import AgeVerification from './components/AgeVerification';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 max-w-5xl mx-auto">
      <AgeVerification />
      
      {/* Encabezado Principal */}
      <section className="mb-12 text-center py-8">
        <h1 className="text-4xl font-extrabold tracking-wider text-white">STORY WEAVER HUB</h1>
        <p className="text-neutral-400 mt-2 text-sm sm:text-base">Compañía, relatos y vínculos profundos</p>
        <span className="inline-block mt-4 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs px-3 py-1 rounded-full">
          Modo Seguro (+18)
        </span>
      </section>

      {/* Sección de Personajes - Diseño Inmersivo */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-2">Elige tu compañía</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta Samantha - Fondo Inmersivo */}
          <article className="relative h-96 rounded-2xl overflow-hidden group shadow-xl border border-neutral-800">
            {/* Imagen de Fondo (asegúrate de tener la imagen en /public/samantha.jpg) */}
            <img 
              src="/samantha.jpg" 
              alt="Samantha" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Degradado para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Contenido de la tarjeta superpuesto */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div className='flex justify-end'>
                  <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider bg-black/50 px-2 py-1 rounded">Romance profundo</span>
              </div>
              <div className='text-left'>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Samantha</h3>
                <p className="text-sm text-neutral-300 mt-2 max-w-sm drop-shadow-sm">
                  Atenta, analítica y con una cercanía que se construye paso a paso.
                </p>
                <a 
                  href="/chat/samantha" 
                  className="mt-6 inline-block bg-white text-neutral-950 font-semibold py-3 px-6 rounded-full hover:bg-neutral-200 transition text-sm shadow-lg"
                >
                  Iniciar Conversación
                </a>
              </div>
            </div>
          </article>

          {/* Tarjeta Elena - Fondo Inmersivo (Mismo estilo) */}
          <article className="relative h-96 rounded-2xl overflow-hidden group shadow-xl border border-neutral-800">
            <img 
              src="/elena.jpg" 
              alt="Elena" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div className='flex justify-end'>
                  <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider bg-black/50 px-2 py-1 rounded">Compañía nocturna</span>
              </div>
              <div className='text-left'>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">Elena</h3>
                <p className="text-sm text-neutral-300 mt-2 max-w-sm drop-shadow-sm">
                  Intensa, directa y dispuesta a explorar los límites de la confianza mutua.
                </p>
                <a 
                  href="/chat/elena" 
                  className="mt-6 inline-block bg-white text-neutral-950 font-semibold py-3 px-6 rounded-full hover:bg-neutral-200 transition text-sm shadow-lg"
                >
                  Iniciar Conversación
                </a>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* Sección de Relatos Recientes */}
      <section>
        <h2 className="text-xl font-bold mb-6 border-b border-neutral-800 pb-2">Relatos Recientes</h2>
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white">Ecos de Medianoche</h3>
              <p className="text-sm text-neutral-400 mt-1">Un capítulo exclusivo explorando los recuerdos más íntimos.</p>
              <span className="text-xs text-neutral-500 mt-2 inline-block">Duración: 14:30</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium px-4 py-2 rounded-lg transition">
                Escuchar audio
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}