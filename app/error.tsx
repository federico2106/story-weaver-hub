'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      <h2 className="text-xl font-bold mb-4">Algo salió mal</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}