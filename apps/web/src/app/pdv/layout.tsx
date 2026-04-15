/**
 * Layout standalone do PDV (Ponto de Venda).
 * Sem sidebar, sem navbar — ocupa 100% da tela.
 */
export default function PdvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      {children}
    </div>
  );
}
