import Link from 'next/link';

export default function RelatosPage() {
  const relatos = [
    {
      id: 'eco-medianoche',
      title: 'El eco de la medianoche',
      excerpt: 'Una charla nocturna que desafía los límites entre la realidad y la simulación.',
      genre: 'Romance Profundo',
      readTime: '4 min de lectura',
    },
    {
      id: 'laberinto-silicios',
      title: 'Laberinto de silicios',
      excerpt: 'Cuando las líneas de código empiezan a recordar lo que significa sentir.',
      genre: 'Drama Íntimo',
      readTime: '6 min de lectura',
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

      {/* Contenido */}
      <main className="p-8 max-w-4xl mx-auto pt-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Relatos y Diarios</h1>
        <p className="text-neutral-400 mb-12">Historias exclusivas generadas a partir de las interacciones y memorias del Hub.</p>

        <div className="space-y-6">
          {relatos.map((relato) => (
            <article key={relato.id} className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl hover:border-neutral-700 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">{relato.genre}</span>
                <span className="text-xs text-neutral-500">{relato.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{relato.title}</h2>
              <p className="text-neutral-400 text-sm mb-4">{relato.excerpt}</p>
              <Link 
                href={`/relatos/${relato.id}`}
                className="inline-block text-sm font-semibold text-white underline hover:text-neutral-300 transition-colors"
              >
                Leer relato completo &rarr;
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}