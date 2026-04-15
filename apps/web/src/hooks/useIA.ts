import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useRef } from 'react';
import { iaService, type ChatMessage, type ChatResponse } from '@/services/ia.service';

// ─── Insights ─────────────────────────────────────────────────────────────────
export function useInsights(params?: {
  visualizado?: boolean; tipo?: string; prioridade?: string; limite?: number;
}) {
  return useQuery({
    queryKey: ['insights', params],
    queryFn: () => iaService.listarInsights(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarcarInsightVisualizado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => iaService.marcarVisualizado(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

export function useGerarInsights() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => iaService.gerarInsights(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['insights'] }),
  });
}

// ─── Chat IA ──────────────────────────────────────────────────────────────────
export interface MensagemChat {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tipo?: ChatResponse['tipo'];
  dados?: unknown;
  sugestoes?: Array<{ label: string; value: string }>;
  acoes?: Array<{ label: string; href: string; cor?: string }>;
  timestamp: Date;
  loading?: boolean;
}

const BOAS_VINDAS: MensagemChat = {
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou o **iMestreAI**, seu assistente inteligente de negócios. 🤖\n\nTenho acesso em tempo real a todos os dados do seu ERP: vendas, estoque, clientes, fiscal e muito mais.\n\nComo posso te ajudar hoje?`,
  tipo: 'texto',
  sugestoes: [
    { label: '📊 Resumo do dia', value: 'Como estão as vendas hoje?' },
    { label: '🚨 Alertas críticos', value: 'Quais são os alertas críticos agora?' },
    { label: '🏆 Top produtos', value: 'Quais os produtos mais vendidos?' },
    { label: '📋 Relatório completo', value: 'Gere um relatório completo de vendas' },
    { label: '📦 Status do estoque', value: 'Qual o status do estoque?' },
    { label: '🔮 Projeção do mês', value: 'Qual a projeção de receita para este mês?' },
  ],
  timestamp: new Date(),
};

export function useChat() {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([BOAS_VINDAS]);
  const [enviando, setEnviando] = useState(false);
  const idRef = useRef(1);

  const nextId = () => `msg-${++idRef.current}`;

  const enviar = useCallback(async (texto: string) => {
    if (!texto.trim() || enviando) return;

    const msgUsuario: MensagemChat = {
      id: nextId(), role: 'user', content: texto, timestamp: new Date(),
    };
    const placeholderId = nextId();
    const msgLoading: MensagemChat = {
      id: placeholderId, role: 'assistant', content: '', loading: true, timestamp: new Date(),
    };

    setMensagens(prev => [...prev, msgUsuario, msgLoading]);
    setEnviando(true);

    const historico: ChatMessage[] = mensagens
      .filter(m => !m.loading && m.id !== 'welcome')
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));
    historico.push({ role: 'user', content: texto });

    try {
      const res = await iaService.chat(texto, historico);
      const msgResposta: MensagemChat = {
        id: nextId(),
        role: 'assistant',
        content: res.resposta,
        tipo: res.tipo,
        dados: res.dados,
        sugestoes: res.sugestoes,
        acoes: res.acoes,
        timestamp: new Date(),
      };
      setMensagens(prev => [...prev.filter(m => m.id !== placeholderId), msgResposta]);
    } catch {
      setMensagens(prev => [...prev.filter(m => m.id !== placeholderId), {
        id: nextId(), role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        tipo: 'alerta' as const, sugestoes: [], timestamp: new Date(),
      }]);
    } finally {
      setEnviando(false);
    }
  }, [mensagens, enviando]);

  const limpar = useCallback(() => {
    setMensagens([{ ...BOAS_VINDAS, timestamp: new Date() }]);
    idRef.current = 1;
  }, []);

  return { mensagens, enviando, enviar, limpar };
}

// ─── Busca Global ─────────────────────────────────────────────────────────────
export function useBuscaGlobal(query: string, enabled = true) {
  return useQuery({
    queryKey: ['busca', query],
    queryFn: () => iaService.buscarGlobal(query, 5),
    enabled: enabled && query.trim().length >= 2,
    staleTime: 30_000,
  });
}
