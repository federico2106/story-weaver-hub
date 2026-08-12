export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      <h2 className="text-xl font-bold mb-2">Página no encontrada</h2>
      <p className="text-neutral-400 mb-4">La ruta que buscas no existe.</p>
      <a href="/" className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition">
        Volver al inicio
      </a>
    </div>
  );
}