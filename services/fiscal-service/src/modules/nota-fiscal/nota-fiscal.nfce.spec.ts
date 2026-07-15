/**
 * Teste de fluxo da NFC-e (modelo 65) ponta a ponta no NotaFiscalService:
 *   criarRascunho → validarNota → emitirNota
 *
 * Objetivos (escopo NFC-e do plano fiscal):
 *  - Criar rascunho tipo 'NFCE' usa a SÉRIE própria de NFC-e (serieNfce) e a
 *    chave de acesso sai com modelo 65.
 *  - NFC-e a consumidor NÃO identificado (sem destinatário) é aceita.
 *  - Emissão delega ao provedor via emitirNfce (não emitirNfe) e o fake
 *    autoriza reaproveitando a chave do domínio.
 *  - CSC é obrigatório para emitir NFC-e: sem tokenCsc/idCsc → 400.
 *
 * Estratégia: usa o ProvedorFiscalFakeAdapter REAL (autoriza determinístico) e
 * o TributosService REAL (com RegraFiscalRepository mockado). O repositório de
 * nota é um fake em memória mínimo, exercitando a lógica real do serviço
 * (resolução de série, montagem da chave/documento, ciclo de vida).
 */

import { BadRequestException } from '@nestjs/common'
import { NotaFiscalService } from './nota-fiscal.service'
import { ProvedorFiscalFakeAdapter } from '../provedor-fiscal/fake/provedor-fiscal-fake.adapter'
import { StatusProvedorFiscal } from '../provedor-fiscal/tipos/provedor-fiscal.tipos'
import { TributosService } from '../tributos/tributos.service'
import { RegimeTributario } from '../../../generated/client'
import { gerarChaveAcesso, extrairInfoChaveAcesso } from '../../utils/chave-acesso.util'

const TENANT = '10000000-0000-0000-0000-000000000001'

/** Config fiscal do tenant com séries distintas p/ NF-e (1) e NFC-e (9). */
function configFiscal(overrides: Record<string, unknown> = {}) {
  return {
    tenantId: TENANT,
    regimeTributario: RegimeTributario.SIMPLES_NACIONAL,
    ambienteSefaz: 'HOMOLOGACAO',
    naturezaOperacaoPadrao: 'VENDA',
    uf: 'SP',
    cnpj: '11222333000181',
    razaoSocial: 'Empresa Teste LTDA',
    nomeFantasia: 'Loja Teste',
    serieNfe: '1',
    serieNfce: '9',
    proximoNumeroNfe: 1,
    proximoNumeroNfce: 1,
    tokenCsc: 'CSC-TESTE-0001',
    idCsc: '000001',
    ...overrides,
  }
}

/** RegraFiscalRepository mock: CSOSN 102 (Simples), sem impostos destacados. */
function mockTributos(): TributosService {
  const regraRepo = {
    buscarRegraAplicavel: jest.fn().mockResolvedValue({
      cfop: '5102',
      cstIcms: '102',
      aliquotaIcms: 0,
      cstPis: '49',
      aliquotaPis: 0,
      cstCofins: '49',
      aliquotaCofins: 0,
    }),
  } as any
  return new TributosService(regraRepo)
}

/**
 * Fake em memória do NotaFiscalRepository, cobrindo apenas os métodos usados
 * no fluxo criar→validar→emitir. Numeração por (tipo, série).
 */
function repositorioEmMemoria(config: Record<string, unknown>) {
  const notas = new Map<string, any>()
  const contadores = new Map<string, number>()

  return {
    _notas: notas,
    async criarComNumeroAtomico(
      tenantId: string,
      dados: any,
      gerarChave: (numero: number) => string,
      itensCalculados: any[],
      _totais: any,
    ) {
      const serie = dados.serie || '1'
      const chaveContador = `${dados.tipo}:${serie}`
      const inicio =
        dados.tipo === 'NFCE'
          ? (config.proximoNumeroNfce as number)
          : (config.proximoNumeroNfe as number)
      const atual = contadores.get(chaveContador) ?? inicio
      contadores.set(chaveContador, atual + 1)
      const numero = atual
      const chaveAcesso = gerarChave(numero)
      const id = `nota-${notas.size + 1}`
      const nota = {
        id,
        tenantId,
        tipo: dados.tipo,
        serie,
        numero,
        chaveAcesso,
        naturezaOperacao: dados.naturezaOperacao,
        status: 'RASCUNHO',
        dataEmissao: new Date(dados.dataEmissao),
        destinatario: dados.destinatario ?? null,
        pedidoId: dados.pedidoId ?? null,
        clienteId: dados.clienteId ?? null,
        valorProdutos: 0,
        valorTotal: 0,
        valorDesconto: 0,
        valorFrete: 0,
        valorSeguro: 0,
        valorOutros: 0,
        itens: (itensCalculados ?? []).map((item: any, i: number) => ({
          id: `${id}-item-${i + 1}`,
          ...item,
        })),
        eventos: [],
      }
      notas.set(id, nota)
      return nota
    },
    async buscarPorId(_tenantId: string, notaId: string) {
      return notas.get(notaId) ?? null
    },
    async atualizarTributos(
      _tenantId: string,
      notaId: string,
      _itensPersistidos: any[],
      _itensCalculados: any[],
      _totais: any,
      novoStatus: string,
    ) {
      const nota = notas.get(notaId)
      if (nota) {
        nota.status = novoStatus
      }
      return nota
    },
    async armazenarAutorizacao(
      _tenantId: string,
      notaId: string,
      xmlRetorno: string,
      protocolo: string,
    ) {
      const nota = notas.get(notaId)
      if (nota) {
        nota.status = 'AUTORIZADA'
        nota.xmlRetorno = xmlRetorno
        nota.protocolo = protocolo
      }
      return nota
    },
    async atualizarStatus(_tenantId: string, notaId: string, novoStatus: string, dados?: any) {
      const nota = notas.get(notaId)
      if (nota) {
        nota.status = novoStatus
        if (dados) Object.assign(nota, dados)
      }
      return nota
    },
    async registrarEvento(
      tenantId: string,
      notaId: string,
      tipo: string,
      sequencia: number,
      justificativa: string,
    ) {
      const evento = {
        id: `evento-${notaId}-${sequencia}`,
        tenantId,
        notaFiscalId: notaId,
        tipo,
        sequencia,
        justificativa,
        status: 'PENDENTE',
      }
      const nota = notas.get(notaId)
      if (nota) nota.eventos.push(evento)
      return evento
    },
    async atualizarEvento(
      _tenantId: string,
      eventoId: string,
      status: string,
      xmlRetorno?: string,
      protocolo?: string,
    ) {
      for (const nota of notas.values()) {
        const evento = nota.eventos.find((e: any) => e.id === eventoId)
        if (evento) {
          evento.status = status
          evento.xmlRetorno = xmlRetorno
          evento.protocolo = protocolo
          return evento
        }
      }
      return null
    },
    async buscarEventos(notaId: string) {
      const nota = notas.get(notaId)
      return nota ? [...nota.eventos] : []
    },
  } as any
}

/** Monta o service com dependências reais/fakes prontas para o fluxo. */
function montarService(configOverrides: Record<string, unknown> = {}) {
  const config = configFiscal(configOverrides)
  const repo = repositorioEmMemoria(config)
  const configRepo = { obter: jest.fn().mockResolvedValue(config) } as any
  const produtor = {
    publicarNotaAutorizada: jest.fn().mockResolvedValue(undefined),
    publicarNotaRejeitada: jest.fn().mockResolvedValue(undefined),
    publicarNotaCancelada: jest.fn().mockResolvedValue(undefined),
  } as any
  const cache = {
    obter: jest.fn().mockResolvedValue(null),
    armazenar: jest.fn().mockResolvedValue(undefined),
    remover: jest.fn().mockResolvedValue(undefined),
  } as any
  const provedor = new ProvedorFiscalFakeAdapter()

  const service = new NotaFiscalService(
    repo,
    configRepo,
    mockTributos(),
    produtor,
    cache,
    provedor,
  )
  return { service, repo, produtor, provedor }
}

/** DTO de NFC-e a consumidor NÃO identificado (sem destinatário). */
function dtoNfceConsumidorFinal() {
  return {
    tipo: 'NFCE',
    naturezaOperacao: 'VENDA',
    dataEmissao: new Date('2026-01-15T10:00:00.000Z').toISOString(),
    itens: [
      {
        produtoId: '00000000-0000-0000-0000-0000000000aa',
        descricao: 'Refrigerante lata',
        ncm: '22021000',
        cfop: '5102',
        unidade: 'UN',
        quantidade: 2,
        valorUnitario: 5,
        valorTotal: 10,
        valorDesconto: 0,
        origemMercadoria: '0',
        cstIcms: '102',
        aliquotaIcms: 0,
        cstPis: '49',
        aliquotaPis: 0,
        cstCofins: '49',
        aliquotaCofins: 0,
        cstIpi: '53',
        aliquotaIpi: 0,
      },
    ],
  } as any
}

describe('NotaFiscalService — fluxo NFC-e (modelo 65)', () => {
  it('cria rascunho de NFC-e sem destinatário usando a série de NFC-e (serieNfce)', async () => {
    const { service } = montarService()

    const rascunho = await service.criarRascunho(TENANT, dtoNfceConsumidorFinal())

    expect(rascunho.tipo).toBe('NFCE')
    expect(rascunho.status).toBe('RASCUNHO')
    // Série própria de NFC-e (config.serieNfce = '9'), não a de NF-e ('1').
    expect(rascunho.serie).toBe('9')
    expect(rascunho.destinatario).toBeNull()

    // Chave de acesso: 44 dígitos, modelo 65, série 009.
    const info = extrairInfoChaveAcesso(rascunho.chaveAcesso)
    expect(info).not.toBeNull()
    expect(info!.modelo).toBe('65')
    expect(info!.serie).toBe('009')
  })

  it('valida e emite a NFC-e: fake autoriza via emitirNfce reaproveitando a chave', async () => {
    const { service, provedor } = montarService()
    const espiaoNfce = jest.spyOn(provedor, 'emitirNfce')
    const espiaoNfe = jest.spyOn(provedor, 'emitirNfe')

    const rascunho = await service.criarRascunho(TENANT, dtoNfceConsumidorFinal())
    const validada = await service.validarNota(TENANT, rascunho.id)
    expect(validada!.status).toBe('VALIDADA')

    const resultado = await service.emitirNota(TENANT, rascunho.id)

    // Roteou para NFC-e, não NF-e.
    expect(espiaoNfce).toHaveBeenCalledTimes(1)
    expect(espiaoNfe).not.toHaveBeenCalled()
    expect(resultado.status).toBe(StatusProvedorFiscal.AUTORIZADO)
    expect(resultado.chaveAcesso).toBe(rascunho.chaveAcesso)

    const notaFinal = await service.buscarPorId(TENANT, rascunho.id)
    expect((notaFinal as any).status).toBe('AUTORIZADA')
    expect((notaFinal as any).protocolo).toBeDefined()
  })

  it('bloqueia emissão de NFC-e quando o CSC não está configurado (400)', async () => {
    // Sem tokenCsc/idCsc na config → guarda de CSC dispara.
    const { service } = montarService({ tokenCsc: null, idCsc: null })

    const rascunho = await service.criarRascunho(TENANT, dtoNfceConsumidorFinal())
    await service.validarNota(TENANT, rascunho.id)

    await expect(service.emitirNota(TENANT, rascunho.id)).rejects.toBeInstanceOf(
      BadRequestException,
    )
  })

  it('gera DANFCE (PDF válido) para NFC-e autorizada', async () => {
    const { service } = montarService()
    const rascunho = await service.criarRascunho(TENANT, dtoNfceConsumidorFinal())
    await service.validarNota(TENANT, rascunho.id)
    await service.emitirNota(TENANT, rascunho.id)

    const pdf = await service.gerarDanfe(TENANT, rascunho.id)
    expect(pdf).toBeInstanceOf(Buffer)
    expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })

  it('a chave da NFC-e é aceita pelo validador de chave (DV correto)', () => {
    // Sanidade: geração de chave modelo 65 produz DV válido.
    const chave = gerarChaveAcesso({
      uf: 'SP',
      ano: 2026,
      mes: 1,
      cnpj: '11222333000181',
      tipo: 'NFCE',
      serie: '9',
      numero: 1,
    })
    const info = extrairInfoChaveAcesso(chave)
    expect(info?.modelo).toBe('65')
  })
})

/** DTO de NF-e (modelo 55) vinculada a um pedido, com destinatário válido. */
function dtoNfeComPedido(pedidoId: string) {
  return {
    tipo: 'NFE',
    naturezaOperacao: 'VENDA',
    dataEmissao: new Date('2026-01-15T10:00:00.000Z').toISOString(),
    pedidoId,
    destinatario: { nome: 'Cliente Teste', cpfCnpj: '52998224725', estado: 'SP' },
    itens: [
      {
        produtoId: '00000000-0000-0000-0000-0000000000bb',
        descricao: 'Produto de teste',
        ncm: '61091000',
        cfop: '5102',
        unidade: 'UN',
        quantidade: 1,
        valorUnitario: 100,
        valorTotal: 100,
        valorDesconto: 0,
        origemMercadoria: '0',
        cstIcms: '102',
        aliquotaIcms: 0,
        cstPis: '49',
        aliquotaPis: 0,
        cstCofins: '49',
        aliquotaCofins: 0,
        cstIpi: '53',
        aliquotaIpi: 0,
      },
    ],
  } as any
}

describe('NotaFiscalService — cancelamento propaga pedidoId', () => {
  it('publica nota.cancelada com o pedidoId vinculado à nota', async () => {
    const { service, produtor, repo } = montarService()
    const pedidoId = '20000000-0000-0000-0000-000000000009'

    const rascunho = await service.criarRascunho(TENANT, dtoNfeComPedido(pedidoId))
    await service.validarNota(TENANT, rascunho.id)
    await service.emitirNota(TENANT, rascunho.id)

    // Precondição do cancelamento: nota AUTORIZADA e com pedidoId.
    const autorizada = repo._notas.get(rascunho.id)
    expect(autorizada.status).toBe('AUTORIZADA')
    expect(autorizada.pedidoId).toBe(pedidoId)

    const resultado = await service.cancelarNota(TENANT, rascunho.id, {
      justificativa: 'Cancelamento por erro de digitacao no valor da venda',
    } as any)

    expect(resultado.status).toBe(StatusProvedorFiscal.CANCELADO)
    expect(produtor.publicarNotaCancelada).toHaveBeenCalledTimes(1)
    // Assinatura: (tenantId, notaId, justificativa, pedidoId)
    expect(produtor.publicarNotaCancelada).toHaveBeenCalledWith(
      TENANT,
      rascunho.id,
      expect.stringContaining('Cancelamento'),
      pedidoId,
    )
  })
})
