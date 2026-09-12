import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google'
import Navbar from './components/Navbar'


export const metadata: Metadata = {
  title: 'Story Weaver Hub',
  description: 'Espacio Privado de Interacción',
};

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`bg-neutral-950 text-neutral-100 antialiased ${spaceGrotesk.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}