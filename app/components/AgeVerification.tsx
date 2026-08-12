'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    // Revisa si ya aceptó la advertencia antes en este navegador
    const isVerified = localStorage.getItem('age_verified');
    if (!isVerified) {
      setVerified(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('age_verified', 'true');
    setVerified(true);
  };

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-md p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-xl font-bold text-neutral-100 mb-2">Control de Acceso (+18)</h2>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          Este sitio web contiene relatos interactivos y experiencias de ficción dirigidas a un público adulto. Debes ser mayor de 18 años para ingresar.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.href = 'https://www.google.com'}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-2.5 rounded font-medium text-sm transition"
          >
            Soy menor
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-white hover:bg-neutral-200 text-neutral-950 py-2.5 rounded font-semibold text-sm transition"
          >
            Soy mayor de 18 años
          </button>
        </div>
      </div>
    </div>
  );
}