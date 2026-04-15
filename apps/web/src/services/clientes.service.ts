import api from '@/lib/api';
import type {
  Cliente,
  ClienteDetalhe,
  EstatisticasClientes,
  FiltrosCliente,
  RespostaPaginada,
  ResumoCliente,
  Interacao,
  Endereco,
  Contato,
  AnaliseIA,
  CriarClienteDto,
  RegistrarInteracaoDto,
} from '@/types';

export const clientesService = {
  // ─── CRUD básico ───────────────────────────────────────────────────────────

  listar: async (filtros?: FiltrosCliente): Promise<RespostaPaginada<Cliente>> => {
    const { data } = await api.get('/v1/clientes', { params: filtros });
    return data;
  },

  buscarPorId: async (id: string): Promise<ClienteDetalhe> => {
    const { data } = await api.get(`/v1/clientes/${id}`);
    return data;
  },

  obterResumo: async (id: string): Promise<ResumoCliente> => {
    const { data } = await api.get(`/v1/clientes/${id}/resumo`);
    return data;
  },

  obterEstatisticas: async (): Promise<EstatisticasClientes> => {
    const { data } = await api.get('/v1/clientes/estatisticas');
    return data;
  },

  criar: async (dto: CriarClienteDto): Promise<ClienteDetalhe> => {
    const { data } = await api.post('/v1/clientes', dto);
    return data;
  },

  atualizar: async (id: string, dto: Partial<CriarClienteDto>): Promise<ClienteDetalhe> => {
    const { data } = await api.put(`/v1/clientes/${id}`, dto);
    return data;
  },

  inativar: async (id: string): Promise<void> => {
    await api.delete(`/v1/clientes/${id}`);
  },

  // ─── Interações / Timeline ─────────────────────────────────────────────────

  listarInteracoes: async (clienteId: string, pagina = 1, limite = 50): Promise<RespostaPaginada<Interacao>> => {
    const { data } = await api.get(`/v1/clientes/${clienteId}/interacoes`, {
      params: { pagina, limite },
    });
    return data;
  },

  obterTimeline: async (clienteId: string, limite = 50): Promise<Interacao[]> => {
    const { data } = await api.get(`/v1/clientes/${clienteId}/timeline`, {
      params: { limite },
    });
    return Array.isArray(data) ? data : data?.itens ?? [];
  },

  registrarInteracao: async (clienteId: string, dto: RegistrarInteracaoDto): Promise<Interacao> => {
    const { data } = await api.post(`/v1/clientes/${clienteId}/interacoes`, dto);
    return data;
  },

  // ─── Endereços ─────────────────────────────────────────────────────────────

  listarEnderecos: async (clienteId: string): Promise<Endereco[]> => {
    const { data } = await api.get(`/v1/clientes/${clienteId}/enderecos`);
    return Array.isArray(data) ? data : data?.dados ?? [];
  },

  criarEndereco: async (clienteId: string, dto: Omit<Endereco, 'id'>): Promise<Endereco> => {
    const { data } = await api.post(`/v1/clientes/${clienteId}/enderecos`, dto);
    return data;
  },

  removerEndereco: async (clienteId: string, enderecoId: string): Promise<void> => {
    await api.delete(`/v1/clientes/${clienteId}/enderecos/${enderecoId}`);
  },

  // ─── Contatos ──────────────────────────────────────────────────────────────

  listarContatos: async (clienteId: string): Promise<Contato[]> => {
    const { data } = await api.get(`/v1/clientes/${clienteId}/contatos`);
    return Array.isArray(data) ? data : data?.dados ?? [];
  },

  criarContato: async (clienteId: string, dto: Omit<Contato, 'id'>): Promise<Contato> => {
    const { data } = await api.post(`/v1/clientes/${clienteId}/contatos`, dto);
    return data;
  },

  removerContato: async (clienteId: string, contatoId: string): Promise<void> => {
    await api.delete(`/v1/clientes/${clienteId}/contatos/${contatoId}`);
  },

  // ─── ViaCEP ────────────────────────────────────────────────────────────────

  buscarCEP: async (cep: string): Promise<{
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
  }> => {
    const cepLimpo = cep.replace(/\D/g, '');
    const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    return resp.json();
  },

  // ─── Análise IA ────────────────────────────────────────────────────────────

  analisarComIA: async (cliente: ClienteDetalhe, resumo?: ResumoCliente): Promise<AnaliseIA> => {
    const diasDesdeUltimaCompra = resumo?.ultimaCompra
      ? Math.floor((Date.now() - new Date(resumo.ultimaCompra).getTime()) / 86400000)
      : resumo?.diasDesdeUltimaCompra ?? 999;

    const prompt = `Você é um analista de CRM especializado. Analise este cliente e retorne SOMENTE um objeto JSON válido, sem markdown, sem explicações.

Dados do cliente:
- Nome: ${cliente.nome}
- Tipo: ${cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
- Status: ${cliente.status}
- Origem: ${cliente.origem ?? 'Não informada'}
- Tags: ${(cliente.tags ?? []).join(', ') || 'Nenhuma'}
- Total gasto: R$ ${(resumo?.totalCompras ?? cliente.totalCompras ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Número de pedidos: ${resumo?.totalPedidos ?? cliente.quantidadePedidos ?? 0}
- Ticket médio: R$ ${(resumo?.ticketMedio ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Dias desde última compra: ${diasDesdeUltimaCompra}
- Score atual: ${resumo?.score ?? cliente.score ?? 'N/A'}

Retorne APENAS este JSON (sem markdown):
{
  "perfil": "string curta descrevendo o perfil (ex: Cliente VIP frequente, Prospect inativo, Comprador ocasional)",
  "riscoChurn": número de 0 a 100,
  "potencialCrescimento": número de 0 a 100,
  "valorVidaCliente": "estimativa do CLV (ex: Alto - R$ 50k+, Médio - R$ 10-50k, Baixo)",
  "acoesRecomendadas": ["ação 1", "ação 2", "ação 3"],
  "analise": "parágrafo curto com análise estratégica do cliente"
}`;

    try {
      const { data } = await api.post('/v1/assistente/comando', { comando: prompt });
      const texto: string = data?.resposta ?? data?.conteudo ?? '';
      const jsonMatch = texto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return { ...JSON.parse(jsonMatch[0]), geradoEm: new Date().toISOString() };
      }
      throw new Error('Resposta inválida da IA');
    } catch {
      // Fallback determinístico baseado em RFM
      return clientesService._analiseRFM(cliente, resumo, diasDesdeUltimaCompra);
    }
  },

  _analiseRFM: (cliente: ClienteDetalhe, resumo?: ResumoCliente, diasDesdeUltimaCompra = 999): AnaliseIA => {
    const totalCompras = resumo?.totalCompras ?? cliente.totalCompras ?? 0;
    const totalPedidos = resumo?.totalPedidos ?? cliente.quantidadePedidos ?? 0;
    const ticketMedio = resumo?.ticketMedio ?? (totalPedidos > 0 ? totalCompras / totalPedidos : 0);

    // Recency score (0-100, menor = mais recente = melhor)
    const recency = diasDesdeUltimaCompra < 30 ? 100
      : diasDesdeUltimaCompra < 60 ? 80
      : diasDesdeUltimaCompra < 90 ? 60
      : diasDesdeUltimaCompra < 180 ? 40
      : diasDesdeUltimaCompra < 365 ? 20
      : 5;

    // Frequency score
    const frequency = totalPedidos >= 20 ? 100
      : totalPedidos >= 10 ? 80
      : totalPedidos >= 5 ? 60
      : totalPedidos >= 2 ? 40
      : 20;

    // Monetary score
    const monetary = totalCompras >= 50000 ? 100
      : totalCompras >= 20000 ? 80
      : totalCompras >= 5000 ? 60
      : totalCompras >= 1000 ? 40
      : 20;

    const rfmScore = Math.round((recency * 0.3 + frequency * 0.35 + monetary * 0.35));
    const riscoChurn = Math.max(0, 100 - rfmScore - (diasDesdeUltimaCompra < 30 ? 20 : 0));
    const potencialCrescimento = Math.min(100, rfmScore + (ticketMedio > 500 ? 10 : 0));

    const clv = totalCompras >= 50000 ? 'Alto — R$ 50k+' : totalCompras >= 10000 ? 'Médio — R$ 10–50k' : 'Baixo — abaixo de R$ 10k';

    let perfil: string;
    let acoes: string[];

    if (rfmScore >= 80) {
      perfil = 'Cliente VIP — Alta frequência e valor';
      acoes = ['Oferecer programa de fidelidade exclusivo', 'Agendar contato proativo para cross-sell', 'Enviar ofertas personalizadas de produtos premium'];
    } else if (rfmScore >= 60) {
      perfil = 'Cliente promissor — Bom potencial de crescimento';
      acoes = ['Criar campanha de up-sell direcionada', 'Oferecer condições especiais de parcelamento', 'Convidar para lançamentos exclusivos'];
    } else if (rfmScore >= 40) {
      perfil = 'Cliente ocasional — Compra esporádica';
      acoes = ['Enviar newsletter com novidades e promoções', 'Oferecer cupom de desconto para reativação', 'Fazer ligação de relacionamento'];
    } else {
      perfil = 'Cliente em risco — Inativo há muito tempo';
      acoes = ['Enviar oferta de reativação com desconto especial', 'Investigar motivo da inatividade', 'Considerar campanha de winback'];
    }

    return {
      perfil,
      riscoChurn,
      potencialCrescimento,
      valorVidaCliente: clv,
      acoesRecomendadas: acoes,
      analise: `Cliente com score RFM de ${rfmScore}/100. ${diasDesdeUltimaCompra < 365 ? `Última compra há ${diasDesdeUltimaCompra} dias.` : 'Sem compras no último ano.'} Total investido de R$ ${totalCompras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em ${totalPedidos} pedido(s). ${riscoChurn > 60 ? 'Atenção: risco elevado de perda deste cliente.' : 'Relacionamento com potencial de desenvolvimento.'}`,
      geradoEm: new Date().toISOString(),
    };
  },
};
