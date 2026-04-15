'use client';

/**
 * Shell responsivo do dashboard.
 * Gerencia o estado do menu mobile e passa props para Sidebar e Header.
 */

import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const abrirSidebar  = useCallback(() => setSidebarAberta(true),  []);
  const fecharSidebar = useCallback(() => setSidebarAberta(false), []);

  // Fecha ao redimensionar para desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setSidebarAberta(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') fecharSidebar(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [fecharSidebar]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* ── Overlay mobile ─────────────────────────────────────── */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={fecharSidebar}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <Sidebar aberta={sidebarAberta} onFechar={fecharSidebar} />

      {/* ── Área principal ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onAbrirMenu={abrirSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
