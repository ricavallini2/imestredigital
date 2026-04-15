/**
 * ═══════════════════════════════════════════════════════════════
 * iMestreDigital - Tópicos e Eventos do Kafka
 * ═══════════════════════════════════════════════════════════════
 * Define todos os tópicos Kafka e tipos de eventos que trafegam
 * entre os microserviços. Centralizar aqui garante que todos
 * os serviços usem os mesmos nomes e formatos.
 */

// ─── Tópicos do Kafka ──────────────────────────────────────

/** Nomes dos tópicos Kafka (um por domínio) */
export const TOPICOS = {
  /** Eventos de autenticação e tenants */
  AUTH: 'imestredigital.auth',
  /** Eventos de catálogo de produtos */
  CATALOGO: 'imestredigital.catalogo',
  /** Eventos de estoque e movimentações */
  ESTOQUE: 'imestredigital.estoque',
  /** Eventos de pedidos */
  PEDIDOS: 'imestredigital.pedidos',
  /** Eventos de marketplace */
  MARKETPLACE: 'imestredigital.marketplace',
  /** Eventos fiscais */
  FISCAL: 'imestredigital.fiscal',
  /** Eventos financeiros */
  FINANCEIRO: 'imestredigital.financeiro',
  /** Eventos de clientes/CRM */
  CLIENTES: 'imestredigital.clientes',
  /** Eventos de notificações */
  NOTIFICACOES: 'imestredigital.notificacoes',
} as const;

// ─── Tipos de Eventos ──────────────────────────────────────

/** Eventos de Autenticação */
export enum EventosAuth {
  TENANT_CRIADO = 'tenant.criado',
  TENANT_ATUALIZADO = 'tenant.atualizado',
  TENANT_SUSPENSO = 'tenant.suspenso',
  USUARIO_CRIADO = 'usuario.criado',
  USUARIO_LOGADO = 'usuario.logado',
  USUARIO_DESATIVADO = 'usuario.desativado',
  SENHA_ALTERADA = 'senha.alterada',
}

/** Eventos de Catálogo */
export enum EventosCatalogo {
  PRODUTO_CRIADO = 'produto.criado',
  PRODUTO_ATUALIZADO = 'produto.atualizado',
  PRODUTO_REMOVIDO = 'produto.removido',
  PRECO_ALTERADO = 'preco.alterado',
  CATEGORIA_CRIADA = 'categoria.criada',
  CATEGORIA_ATUALIZADA = 'categoria.atualizada',
}

/** Eventos de Estoque */
export enum EventosEstoque {
  ESTOQUE_ATUALIZADO = 'estoque.atualizado',
  ESTOQUE_RESERVADO = 'estoque.reservado',
  RESERVA_CANCELADA = 'reserva.cancelada',
  ESTOQUE_BAIXO = 'estoque.baixo',
  MOVIMENTACAO_CRIADA = 'movimentacao.criada',
  TRANSFERENCIA_CRIADA = 'transferencia.criada',
}

/** Eventos de Pedidos */
export enum EventosPedidos {
  PEDIDO_CRIADO = 'pedido.criado',
  PEDIDO_APROVADO = 'pedido.aprovado',
  PEDIDO_SEPARADO = 'pedido.separado',
  PEDIDO_EXPEDIDO = 'pedido.expedido',
  PEDIDO_ENTREGUE = 'pedido.entregue',
  PEDIDO_CANCELADO = 'pedido.cancelado',
  DEVOLUCAO_SOLICITADA = 'devolucao.solicitada',
}

/** Eventos de Marketplace */
export enum EventosMarketplace {
  ANUNCIO_PUBLICADO = 'anuncio.publicado',
  ANUNCIO_ATUALIZADO = 'anuncio.atualizado',
  ANUNCIO_PAUSADO = 'anuncio.pausado',
  PEDIDO_RECEBIDO = 'pedido.marketplace.recebido',
  PERGUNTA_RECEBIDA = 'pergunta.recebida',
  PERGUNTA_RESPONDIDA = 'pergunta.respondida',
}

/** Eventos Fiscais */
export enum EventosFiscais {
  NF_EMITIDA = 'nf.emitida',
  NF_AUTORIZADA = 'nf.autorizada',
  NF_REJEITADA = 'nf.rejeitada',
  NF_CANCELADA = 'nf.cancelada',
  SPED_GERADO = 'sped.gerado',
}

/** Eventos Financeiros */
export enum EventosFinanceiros {
  PAGAMENTO_RECEBIDO = 'pagamento.recebido',
  PAGAMENTO_ATRASADO = 'pagamento.atrasado',
  CONTA_CRIADA = 'conta.criada',
  CONCILIACAO_REALIZADA = 'conciliacao.realizada',
  FLUXO_CAIXA_ATUALIZADO = 'fluxo.caixa.atualizado',
}

/** Eventos de Clientes */
export enum EventosClientes {
  CLIENTE_CRIADO = 'cliente.criado',
  CLIENTE_ATUALIZADO = 'cliente.atualizado',
  SEGMENTO_ALTERADO = 'segmento.alterado',
}

/** Eventos de Notificações */
export enum EventosNotificacoes {
  NOTIFICACAO_ENVIADA = 'notificacao.enviada',
  EMAIL_ENVIADO = 'email.enviado',
  SMS_ENVIADO = 'sms.enviado',
  PUSH_ENVIADO = 'push.enviado',
}
