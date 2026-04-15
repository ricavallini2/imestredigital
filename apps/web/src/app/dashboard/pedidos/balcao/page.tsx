'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Monitor, ExternalLink, Loader2 } from 'lucide-react';

/**
 * Launcher para o PDV de Venda Balcão.
 * Abre o PDV em tela cheia (nova janela/aba) e redireciona de volta.
 */
export default function BalcaoLauncherPage() {
  const router = useRouter();

  useEffect(() => {
    window.open('/pdv', '_blank', 'noopener,noreferrer');
    // Volta para a lista de pedidos após abrir o PDV
    router.replace('/dashboard/pedidos');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="rounded-full bg-marca-100 dark:bg-marca-900/30 p-6">
        <Monitor className="h-14 w-14 text-marca-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Abrindo PDV...</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          O Ponto de Venda está abrindo em uma nova tela.
        </p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      <Link href="/pdv" target="_blank"
        className="flex items-center gap-2 text-sm font-medium text-marca-600 dark:text-marca-400 hover:underline">
        <ExternalLink className="h-4 w-4" /> Abrir PDV manualmente
      </Link>
    </div>
  );
}
