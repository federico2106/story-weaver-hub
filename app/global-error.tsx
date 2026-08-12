'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-neutral-950 text-neutral-100 flex h-screen flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Algo salió mal</h2>
          <p className="text-neutral-400 text-sm mb-4">
            {error.message || 'Se produjo un error inesperado en la aplicación.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition font-medium"
          >
            Volver a intentar
          </button>
        </div>
      </body>
    </html>
  );
}