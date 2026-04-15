/**
 * Layout raiz da aplicação iMestreDigital.
 *
 * Configura:
 * - Metadata global (título, descrição)
 * - Fonte Inter do Google
 * - Providers globais (React Query, Zustand, Tema)
 * - Estrutura base HTML
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'iMestreDigital - ERP Inteligente',
    template: '%s | iMestreDigital',
  },
  description: 'ERP com Inteligência Artificial para comércio brasileiro. Gerencie produtos, estoque, pedidos, marketplaces e fiscal em uma única plataforma.',
  keywords: ['ERP', 'gestão', 'marketplace', 'e-commerce', 'IA', 'inteligência artificial', 'nota fiscal', 'estoque'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
