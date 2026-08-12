import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Story Weaver Hub',
  description: 'Espacio Privado de Interacción',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-950 text-neutral-100 antialiased">
       
        {children}
      </body>
    </html>
  );
}