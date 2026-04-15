'use client';

/**
 * Página de Perguntas de Clientes
 * Responder perguntas sobre anúncios com sugestões de IA
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Search,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';
import { usePerguntas, useResponderPergunta, Pergunta } from '@/hooks/useMarketplaces';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 1)  return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

const CANAL_CONFIG: Record<string, { emoji: string; label: string; cor: string; corText: string }> = {
  MERCADO_LIVRE: { emoji: '🟠', label: 'Mercado Livre', cor: 'bg-yellow-100 dark:bg-yellow-900/30', corText: 'text-yellow-700 dark:text-yellow-400' },
  SHOPEE:        { emoji: '🔴', label: 'Shopee',        cor: 'bg-orange-100 dark:bg-orange-900/30', corText: 'text-orange-700 dark:text-orange-400' },
  AMAZON:        { emoji: '🟤', label: 'Amazon',        cor: 'bg-amber-100  dark:bg-amber-900/30',  corText: 'text-amber-700  dark:text-amber-400'  },
  SHOPIFY:       { emoji: '🟢', label: 'Shopify',       cor: 'bg-green-100  dark:bg-green-900/30',  corText: 'text-green-700  dark:text-green-400'  },
};

// ─── IA Suggestion Engine ─────────────────────────────────────────────────────

function gerarSugestoes(pergunta: string): string[] {
  const p = pergunta.toLowerCase();

  if (p.includes('frete') || p.includes('entrega') || p.includes('prazo') || p.includes('envio')) {
    return [
      'Olá! Enviamos para todo o Brasil via Correios (PAC e SEDEX) e transportadoras. O prazo estimado é de 3 a 7 dias úteis para capitais e 5 a 12 dias para interior. O frete é calculado no checkout. Qualquer dúvida, estamos à disposição!',
      'Oi! Realizamos envios para todos os estados do Brasil. Após a confirmação do pagamento, despachamos em até 1 dia útil. O rastreamento é enviado por e-mail. Prazo médio: 3-7 dias úteis para capitais.',
      'Olá! Trabalhamos com envio expresso via SEDEX (1-3 dias úteis) e econômico via PAC (5-8 dias úteis). O valor do frete aparece ao calcular no anúncio. Emitimos nota fiscal em todos os pedidos!',
    ];
  }

  if (p.includes('garantia') || p.includes('defeito') || p.includes('devolução') || p.includes('troca')) {
    return [
      'Olá! Todos os nossos produtos possuem garantia do fabricante (mínimo 12 meses). Em caso de defeito, abrimos troca ou devolução imediata. Também seguimos o Código de Defesa do Consumidor com 7 dias para devolução sem justificativa.',
      'Oi! Oferecemos garantia completa de 12 meses contra defeitos de fabricação. Se receber algo com problema, entre em contato e resolvemos com troca ou reembolso total. Nossa satisfação é garantida!',
      'Olá! A garantia é de 12 meses com suporte direto. Se o produto apresentar qualquer defeito, fazemos a troca sem burocracia. Basta entrar em contato pelo chat. Atendemos de segunda a sexta, das 9h às 18h.',
    ];
  }

  if (p.includes('parcelar') || p.includes('parcel') || p.includes('cartão') || p.includes('pix') || p.includes('pagamento')) {
    return [
      'Olá! Aceitamos todas as formas de pagamento: cartão de crédito em até 12x sem juros, boleto bancário, PIX (com desconto especial) e débito online. O parcelamento mínimo é de R$ 50 por parcela.',
      'Oi! Pagamento facilitado: PIX com aprovação imediata, cartão de crédito até 12x sem juros (para valores acima de R$ 300), boleto bancário e débito. Parcelamos de forma inteligente para caber no seu bolso!',
      'Olá! Parcelamos em até 12x sem juros no cartão de crédito Visa, Master, Elo e Amex. Também aceitamos PIX com aprovação instantânea. Boleto bancário com prazo de 3 dias úteis para compensação.',
    ];
  }

  if (p.includes('original') || p.includes('garantia apple') || p.includes('anatel') || p.includes('nota fiscal') || p.includes('nf')) {
    return [
      'Olá! Sim, produto 100% original com nota fiscal eletrônica e garantia do fabricante. Todos os nossos produtos são importados legalmente e possuem certificação ANATEL (para eletrônicos). Compra segura e rastreável!',
      'Oi! Trabalhamos somente com produtos originais, lacrados, com nota fiscal e certificação oficial. Somos empresa regularmente constituída com CNPJ ativo. Toda compra tem suporte pós-venda garantido.',
      'Olá! Produto original com NF-e (Nota Fiscal Eletrônica), garantia do fabricante e certificação ANATEL. Emitimos documento fiscal para pessoa física e jurídica. Pode comprar com total segurança!',
    ];
  }

  if (p.includes('estoque') || p.includes('disponível') || p.includes('tem') || p.includes('cores') || p.includes('tamanho')) {
    return [
      'Olá! Sim, temos em estoque! O produto está disponível para entrega imediata. Informe o tamanho/cor de preferência no momento do pedido ou via chat antes de finalizar a compra.',
      'Oi! Produto disponível em estoque. Temos várias opções de tamanho e cor. Confirme a variação desejada no anúncio ou me informe e verifico a disponibilidade específica para você.',
      'Olá! Estoque disponível, pode comprar! Despacho em até 24h úteis após confirmação do pagamento. Se precisar de alguma variação específica, é só me informar que verifico.',
    ];
  }

  if (p.includes('compatível') || p.includes('funciona') || p.includes('ios') || p.includes('android') || p.includes('windows') || p.includes('mac')) {
    return [
      'Olá! O produto é compatível com iOS e Android. Para uso em computador, funciona com Windows 10/11 e macOS. Qualquer dúvida específica sobre compatibilidade, é só me informar o modelo do seu dispositivo.',
      'Oi! Compatibilidade universal: funciona com iOS (iPhone/iPad), Android, Windows e macOS. Driver de instalação incluído quando necessário. Aceitamos troca se houver qualquer incompatibilidade.',
      'Olá! Produto com ampla compatibilidade. Consulte as especificações técnicas no anúncio ou me informe o modelo do dispositivo que verifico a compatibilidade específica para você.',
    ];
  }

  // Genérico
  return [
    'Olá! Obrigado pelo interesse no produto. Pode realizar a compra com total segurança — produto original, com nota fiscal e garantia. Qualquer dúvida, estou à disposição para ajudar!',
    'Oi! Fico feliz em ajudar. Para informações detalhadas sobre o produto, consulte a descrição completa no anúncio. Se precisar de algo específico, me informe e respondo com prazer!',
    'Olá! Claro, pode me perguntar à vontade. Estamos sempre disponíveis para atender melhor nossos clientes. Compra segura, com NF, garantia e entrega rápida para todo o Brasil!',
  ];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-12 w-full rounded-lg" />
      <Skeleton className="mt-3 h-9 w-28 rounded-lg" />
    </div>
  );
}

// ─── Response Modal ───────────────────────────────────────────────────────────

interface ResponderModalProps {
  pergunta: Pergunta;
  onClose: () => void;
  onSend: (id: string, resposta: string) => void;
  enviando: boolean;
}

function ResponderModal({ pergunta, onClose, onSend, enviando }: ResponderModalProps) {
  const sugestoes = useMemo(() => gerarSugestoes(pergunta.pergunta), [pergunta.pergunta]);
  const [resposta, setResposta] = useState('');

  const canalCfg = CANAL_CONFIG[pergunta.canal] ?? CANAL_CONFIG.MERCADO_LIVRE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-marca-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-100">Responder Pergunta</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 space-y-4">
          {/* Contexto */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${canalCfg.cor} ${canalCfg.corText}`}>
                {canalCfg.emoji} {canalCfg.label}
              </span>
              {pergunta.prioridade === 'URGENTE' && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  URGENTE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{pergunta.tituloAnuncio}</p>
          </div>

          {/* Pergunta */}
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {pergunta.comprador} · {tempoRelativo(pergunta.dataPergunta)}
            </p>
            <p className="text-sm text-slate-800 dark:text-slate-200">{pergunta.pergunta}</p>
          </div>

          {/* Sugestões IA */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">Sugestões IA</span>
            </div>
            <div className="space-y-2">
              {sugestoes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setResposta(s)}
                  className="w-full rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-left text-xs text-purple-800 transition-colors hover:bg-purple-100 dark:border-purple-800/40 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40"
                >
                  <span className="mr-1 font-bold text-purple-500">#{i + 1}</span>
                  {s.length > 120 ? s.slice(0, 120) + '…' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sua resposta
            </label>
            <textarea
              rows={4}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite ou selecione uma sugestão acima..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 resize-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">{resposta.length} caracteres</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 px-5 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            disabled={enviando || resposta.trim().length < 5}
            onClick={() => onSend(pergunta.id, resposta.trim())}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-marca-500 py-2 text-sm font-semibold text-white hover:bg-marca-600 disabled:opacity-50 dark:bg-marca-600"
          >
            <Send className="h-4 w-4" />
            {enviando ? 'Enviando...' : 'Enviar Resposta'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pergunta Card ────────────────────────────────────────────────────────────

function PerguntaCard({
  pergunta,
  onResponder,
}: {
  pergunta: Pergunta;
  onResponder: (p: Pergunta) => void;
}) {
  const canalCfg = CANAL_CONFIG[pergunta.canal] ?? CANAL_CONFIG.MERCADO_LIVRE;
  const isUrgente   = pergunta.prioridade === 'URGENTE';
  const isPendente  = pergunta.status === 'PENDENTE';
  const isRespondida = pergunta.status === 'RESPONDIDA';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md dark:bg-slate-800 ${
        isUrgente
          ? 'border-red-200 dark:border-red-800/50'
          : isRespondida
          ? 'border-slate-200 dark:border-slate-700'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Left border urgente */}
      {isUrgente && (
        <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
      )}

      <div className={`p-4 ${isUrgente ? 'pl-5' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${canalCfg.cor} ${canalCfg.corText}`}>
              {canalCfg.emoji} {canalCfg.label}
            </span>
            {isUrgente && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" /> URGENTE
              </span>
            )}
            {isRespondida && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" /> Respondida
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {tempoRelativo(pergunta.dataPergunta)}
          </div>
        </div>

        {/* Produto */}
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {pergunta.tituloAnuncio}
        </p>

        {/* Comprador */}
        <p className="mt-0.5 text-[11px] font-mono text-slate-400">
          👤 {pergunta.comprador}
        </p>

        {/* Pergunta */}
        <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {pergunta.pergunta}
          </p>
        </div>

        {/* Resposta (se respondida) */}
        {isRespondida && pergunta.resposta && (
          <div className="mt-3 rounded-lg border-l-2 border-green-400 bg-green-50 pl-3 pr-3 py-2 dark:border-green-600 dark:bg-green-900/10">
            <p className="mb-1 text-[11px] font-semibold text-green-700 dark:text-green-400">
              Resposta enviada {pergunta.dataResposta ? `· ${tempoRelativo(pergunta.dataResposta)}` : ''}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              {pergunta.resposta}
            </p>
          </div>
        )}

        {/* Botão Responder */}
        {isPendente && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onResponder(pergunta)}
              className="flex items-center gap-2 rounded-lg bg-marca-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-marca-600 dark:bg-marca-600"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Responder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PerguntasPage() {
  const searchParams = useSearchParams();
  const canalInicial  = searchParams.get('canal')  ?? '';
  const statusInicial = searchParams.get('status') ?? '';

  const [busca,      setBusca]      = useState('');
  const [canal,      setCanal]      = useState(canalInicial);
  const [status,     setStatus]     = useState(statusInicial);
  const [respondendo, setRespondendo] = useState<Pergunta | null>(null);

  const filtros = useMemo(() => ({
    busca:  busca  || undefined,
    canal:  canal  || undefined,
    status: status || undefined,
  }), [busca, canal, status]);

  const { data, isLoading }   = usePerguntas(filtros);
  const responderMutation     = useResponderPergunta();

  const perguntas  = data?.dados   ?? [];
  const total      = data?.total   ?? 0;
  const pendentes  = data?.pendentes ?? 0;
  const respondidas = total - pendentes;
  const taxaResposta = total > 0 ? Math.round((respondidas / total) * 100) : 0;

  const handleSend = async (id: string, resposta: string) => {
    await responderMutation.mutateAsync({ id, resposta });
    setRespondendo(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Perguntas</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Responda as dúvidas dos clientes sobre seus anúncios
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Pendentes</p>
          <p className={`mt-1 text-xl font-bold ${pendentes > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {isLoading ? '...' : pendentes}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Respondidas</p>
          <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
            {isLoading ? '...' : respondidas}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Taxa de resposta</p>
          <p className={`mt-1 text-xl font-bold ${taxaResposta >= 90 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
            {isLoading ? '...' : `${taxaResposta}%`}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar pergunta, produto ou comprador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
          />
        </div>

        {/* Canal */}
        <select
          value={canal}
          onChange={(e) => setCanal(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-marca-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          <option value="">Todos os canais</option>
          <option value="MERCADO_LIVRE">🟠 Mercado Livre</option>
          <option value="SHOPEE">🔴 Shopee</option>
          <option value="AMAZON">🟤 Amazon</option>
          <option value="SHOPIFY">🟢 Shopify</option>
        </select>

        {/* Status chips */}
        <div className="flex gap-2">
          {[
            { label: 'Todas',       value: '' },
            { label: 'Pendentes',   value: 'PENDENTE'    },
            { label: 'Respondidas', value: 'RESPONDIDA'  },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => setStatus(chip.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === chip.value
                  ? 'bg-marca-500 text-white dark:bg-marca-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {chip.label}
              {chip.value === 'PENDENTE' && pendentes > 0 && (
                <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {pendentes}
                </span>
              )}
            </button>
          ))}
        </div>

        {(busca || canal || status) && (
          <button
            onClick={() => { setBusca(''); setCanal(''); setStatus(''); }}
            className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          >
            <X className="h-3 w-3" /> Limpar
          </button>
        )}
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : perguntas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 dark:border-slate-700">
          <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 font-medium text-slate-500 dark:text-slate-400">
            Nenhuma pergunta encontrada
          </p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {busca || canal || status ? 'Ajuste os filtros para ver mais resultados.' : 'Você está em dia com as perguntas!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {perguntas.map((p) => (
            <PerguntaCard
              key={p.id}
              pergunta={p}
              onResponder={setRespondendo}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {respondendo && (
        <ResponderModal
          pergunta={respondendo}
          onClose={() => setRespondendo(null)}
          onSend={handleSend}
          enviando={responderMutation.isPending}
        />
      )}
    </div>
  );
}
