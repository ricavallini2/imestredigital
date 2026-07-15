/**
 * Serviço de Clientes
 *
 * Gerencia operações CRUD de clientes com validação de documentos,
 * busca avançada com filtros e cálculo de scoring.
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CriarClienteDto, AtualizarClienteDto, FiltroClienteDto } from '@/dtos/cliente';
import { validarCPF, limparCPF } from '@/utils/validar-cpf.util';
import { validarCNPJ, limparCNPJ } from '@/utils/validar-cnpj.util';
import { formatarCPF, formatarCNPJ } from '@/utils/formatar-documento.util';
import { Cliente, TipoCliente, StatusCliente, OrigemCliente, RegimeTributario, Papel } from '../../../generated/client';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  /**
   * Cria um novo cliente
   *
   * @param tenantId - ID do tenant
   * @param dto - Dados do cliente
   * @returns Cliente criado
   * @throws BadRequestException - Se validação falhar
   * @throws ConflictException - Se documento/email já existe
   */
  async criar(tenantId: string, dto: CriarClienteDto): Promise<Cliente> {
    // Normaliza tipo: aceita PF/PJ como alias
    if ((dto.tipo as string) === 'PF') dto.tipo = 'PESSOA_FISICA' as any;
    if ((dto.tipo as string) === 'PJ') dto.tipo = 'PESSOA_JURIDICA' as any;

    // Valida tipo de cliente e documentos obrigatórios
    if (dto.tipo === 'PESSOA_FISICA') {
      if (!dto.cpf) {
        throw new BadRequestException('CPF obrigatório para pessoa física');
      }

      const cpfLimpo = limparCPF(dto.cpf);
      if (!cpfLimpo || !validarCPF(cpfLimpo)) {
        throw new BadRequestException('CPF inválido');
      }

      dto.cpf = cpfLimpo;
    } else {
      if (!dto.cnpj) {
        throw new BadRequestException('CNPJ obrigatório para pessoa jurídica');
      }

      const cnpjLimpo = limparCNPJ(dto.cnpj);
      if (!cnpjLimpo || !validarCNPJ(cnpjLimpo)) {
        throw new BadRequestException('CNPJ inválido');
      }

      dto.cnpj = cnpjLimpo;
    }

    // Verifica duplicidade de CPF/CNPJ/Email
    const existente = await this.prisma.cliente.findFirst({
      where: {
        tenantId,
        OR: [
          { cpf: dto.cpf },
          { cnpj: dto.cnpj },
          { email: dto.email },
        ],
      },
    });

    if (existente) {
      if (existente.cpf === dto.cpf) {
        throw new ConflictException('CPF já cadastrado para este tenant');
      }
      if (existente.cnpj === dto.cnpj) {
        throw new ConflictException('CNPJ já cadastrado para este tenant');
      }
      if (existente.email === dto.email) {
        throw new ConflictException('Email já cadastrado para este tenant');
      }
    }

    // Define papéis (cadastro unificado): default [CLIENTE]
    const papeis = dto.papeis && dto.papeis.length > 0 ? dto.papeis : ['CLIENTE'];

    // Cria cliente/parceiro
    const cliente = await this.prisma.cliente.create({
      data: {
        tenantId,
        papeis: papeis as any,
        tipo: dto.tipo as TipoCliente,
        nome: dto.nome,
        nomeFantasia: dto.nomeFantasia,
        razaoSocial: dto.razaoSocial,
        cpf: dto.cpf,
        cnpj: dto.cnpj,
        rg: dto.rg,
        inscricaoEstadual: dto.inscricaoEstadual,
        ieIsento: dto.ieIsento ?? false,
        inscricaoMunicipal: dto.inscricaoMunicipal,
        ...(dto.regimeTributario ? { regimeTributario: dto.regimeTributario as any } : {}),
        email: dto.email,
        emailSecundario: dto.emailSecundario,
        telefone: dto.telefone,
        celular: dto.celular,
        dataNascimento: dto.dataNascimento,
        genero: dto.genero,
        observacoes: dto.observacoes,
        tags: dto.tags || [],
        ...(dto.origem ? { origem: dto.origem as any } : {}),
        // Grupo CLIENTE
        ...(dto.limiteCredito != null ? { limiteCredito: dto.limiteCredito } : {}),
        vendedorId: dto.vendedorId,
        // Grupo FORNECEDOR
        prazoPagamento: dto.prazoPagamento,
        condicoesPagamento: dto.condicoesPagamento,
        pixChave: dto.pixChave,
        categoriasFornecidas: dto.categoriasFornecidas || [],
        avaliacaoFornecedor: dto.avaliacaoFornecedor,
      },
    });

    // Cria endereço inline se fornecido
    if (dto.endereco?.logradouro) {
      await this.prisma.enderecoCliente.create({
        data: {
          tenantId,
          clienteId: cliente.id,
          tipo: (dto.endereco.tipo as any) ?? 'AMBOS',
          logradouro: dto.endereco.logradouro,
          numero: dto.endereco.numero ?? 'S/N',
          complemento: dto.endereco.complemento,
          bairro: dto.endereco.bairro ?? '',
          cidade: dto.endereco.cidade ?? '',
          estado: dto.endereco.estado ?? '',
          cep: (dto.endereco.cep ?? '').replace(/\D/g, ''),
          padrao: true,
        },
      });
    }

    this.logger.log(`Cliente criado: ${cliente.id} para tenant ${tenantId}`);

    // Invalida cache de listagem
    await this.cache.remover(`cliente:lista:${tenantId}:*`);

    return cliente;
  }

  /**
   * Lista clientes com filtros e paginação
   *
   * @param tenantId - ID do tenant
   * @param filtro - Filtros de busca
   * @returns Array de clientes e total de registros
   */
  async listar(tenantId: string, filtro: FiltroClienteDto) {
    const { pagina = 1, limite = 20, busca, email, cpf, cnpj, papel, tipo, status, origem, tags, ordenar = 'criadoEm', direcao = 'desc' } = filtro as any;

    const skip = (pagina - 1) * limite;

    // Constrói filtros
    const where: any = { tenantId };

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { email: { contains: busca, mode: 'insensitive' } },
      ];
    }

    if (email) where.email = email;
    if (cpf) where.cpf = limparCPF(cpf) || cpf;
    if (cnpj) where.cnpj = limparCNPJ(cnpj) || cnpj;

    // Filtro por papel (cadastro unificado cliente/fornecedor)
    if (papel) where.papeis = { has: papel };

    // Filtro por tipo de pessoa — normaliza aliases PF/PJ
    if (tipo) {
      const tipoNormalizado = tipo === 'PF' ? 'PESSOA_FISICA' : tipo === 'PJ' ? 'PESSOA_JURIDICA' : tipo;
      where.tipo = tipoNormalizado;
    }

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (origem && origem.length > 0) {
      where.origem = { in: origem };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Define ordenação
    const orderBy: any = {};
    const campoOrdenacao = ['nome', 'email', 'criadoEm', 'ultimaCompra'].includes(ordenar) ? ordenar : 'criadoEm';
    orderBy[campoOrdenacao] = direcao === 'asc' ? 'asc' : 'desc';

    // Executa query
    const [clientes, total] = await Promise.all([
      this.prisma.cliente.findMany({
        where,
        skip,
        take: limite,
        orderBy,
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return {
      dados: clientes,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Busca cliente por ID
   *
   * @param tenantId - ID do tenant
   * @param clienteId - ID do cliente
   * @returns Cliente ou null
   */
  async buscarPorId(tenantId: string, clienteId: string): Promise<Cliente | null> {
    const chaveCache = `cliente:${tenantId}:${clienteId}`;

    // Tenta obter do cache
    let cliente = await this.cache.obter<Cliente>(chaveCache);
    if (cliente) {
      return cliente;
    }

    // Busca no banco
    cliente = await this.prisma.cliente.findFirst({
      where: {
        id: clienteId,
        tenantId,
      },
    });

    if (cliente) {
      // Armazena em cache por 15 minutos
      await this.cache.definir(chaveCache, cliente, 900);
    }

    return cliente;
  }

  /**
   * Busca cliente por CPF ou CNPJ
   *
   * @param tenantId - ID do tenant
   * @param documento - CPF ou CNPJ
   * @returns Cliente ou null
   */
  async buscarPorDocumento(tenantId: string, documento: string): Promise<Cliente | null> {
    const docLimpo = documento.replace(/\D/g, '');

    const cliente = await this.prisma.cliente.findFirst({
      where: {
        tenantId,
        OR: [
          { cpf: docLimpo },
          { cnpj: docLimpo },
        ],
      },
    });

    return cliente || null;
  }

  /**
   * Busca cliente por email
   *
   * @param tenantId - ID do tenant
   * @param email - Email do cliente
   * @returns Cliente ou null
   */
  async buscarPorEmail(tenantId: string, email: string): Promise<Cliente | null> {
    const cliente = await this.prisma.cliente.findFirst({
      where: {
        tenantId,
        email,
      },
    });

    return cliente || null;
  }

  /**
   * Atualiza dados de um cliente
   *
   * @param tenantId - ID do tenant
   * @param clienteId - ID do cliente
   * @param dto - Dados a atualizar
   * @returns Cliente atualizado
   */
  async atualizar(tenantId: string, clienteId: string, dto: AtualizarClienteDto): Promise<Cliente> {
    // Verifica se cliente existe
    const cliente = await this.buscarPorId(tenantId, clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Se email está sendo alterado, verifica duplicidade
    if (dto.email && dto.email !== cliente.email) {
      const existente = await this.prisma.cliente.findFirst({
        where: {
          tenantId,
          email: dto.email,
        },
      });

      if (existente) {
        throw new ConflictException('Email já cadastrado para este tenant');
      }
    }

    // Atualiza cliente (updateMany + where com tenantId garante isolamento multi-tenant)
    const { status, origem, regimeTributario, papeis, ...resto } = dto;
    await this.prisma.cliente.updateMany({
      where: { id: clienteId, tenantId },
      data: {
        ...resto,
        ...(status ? { status: status as StatusCliente } : {}),
        ...(origem ? { origem: origem as OrigemCliente } : {}),
        ...(regimeTributario ? { regimeTributario: regimeTributario as RegimeTributario } : {}),
        ...(papeis && papeis.length > 0 ? { papeis: papeis as unknown as Papel[] } : {}),
      },
    });

    const clienteAtualizado = await this.prisma.cliente.findFirst({
      where: { id: clienteId, tenantId },
    });
    if (!clienteAtualizado) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Invalida cache
    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    this.logger.log(`Cliente atualizado: ${clienteId}`);

    return clienteAtualizado;
  }

  /**
   * Inativa um cliente
   *
   * @param tenantId - ID do tenant
   * @param clienteId - ID do cliente
   * @returns Cliente inativado
   */
  async inativar(tenantId: string, clienteId: string): Promise<Cliente> {
    const cliente = await this.buscarPorId(tenantId, clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const clienteAtualizado = await this.prisma.cliente.update({
      where: { id: clienteId },
      data: { status: 'INATIVO' },
    });

    // Invalida cache
    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return clienteAtualizado;
  }

  /**
   * Atualiza score do cliente
   *
   * @param tenantId - ID do tenant
   * @param clienteId - ID do cliente
   * @param novoScore - Novo score
   * @returns Cliente atualizado
   */
  async atualizarScore(tenantId: string, clienteId: string, novoScore: number): Promise<Cliente> {
    const cliente = await this.buscarPorId(tenantId, clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const clienteAtualizado = await this.prisma.cliente.update({
      where: { id: clienteId },
      data: { score: novoScore },
    });

    // Invalida cache
    await this.cache.remover(`cliente:${tenantId}:${clienteId}`);

    return clienteAtualizado;
  }

  /**
   * Obtém resumo do cliente com estatísticas
   *
   * @param tenantId - ID do tenant
   * @param clienteId - ID do cliente
   * @returns Resumo com dados principais e stats
   */
  async obterResumo(tenantId: string, clienteId: string) {
    const cliente = await this.buscarPorId(tenantId, clienteId);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Obtém relacionamentos
    const [enderecos, contatos, interacoes] = await Promise.all([
      this.prisma.enderecoCliente.findMany({
        where: { clienteId, tenantId },
      }),
      this.prisma.contatoCliente.findMany({
        where: { clienteId, tenantId },
      }),
      this.prisma.interacaoCliente.findMany({
        where: { clienteId, tenantId },
        orderBy: { data: 'desc' },
        take: 5,
      }),
    ]);

    return {
      cliente,
      totalEnderecos: enderecos.length,
      totalContatos: contatos.length,
      enderecoPadrao: enderecos.find(e => e.padrao),
      contatoPrincipal: contatos.find(c => c.principal),
      ultimasInteracoes: interacoes,
    };
  }

  /**
   * Obtém estatísticas gerais de clientes do tenant
   *
   * Retorna contagens (total/ativos/inativos/novos no mês) e
   * agregações monetárias com base em `valorTotalCompras` (Decimal),
   * que é o campo correto de valor financeiro acumulado por cliente.
   */
  async obterEstatisticas(tenantId: string) {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    const [total, ativos, novosEsteMes, agregado] = await Promise.all([
      this.prisma.cliente.count({ where: { tenantId } }),
      this.prisma.cliente.count({ where: { tenantId, status: 'ATIVO' } }),
      this.prisma.cliente.count({ where: { tenantId, criadoEm: { gte: inicioMes } } }),
      this.prisma.cliente.aggregate({
        where: { tenantId },
        _sum: { valorTotalCompras: true, totalCompras: true },
        _avg: { valorTotalCompras: true },
      }),
    ]);

    return {
      total,
      ativos,
      inativos: total - ativos,
      novosEsteMes,
      valorTotalCompras: Number(agregado._sum.valorTotalCompras ?? 0),
      ticketMedioCliente: Number(agregado._avg.valorTotalCompras ?? 0),
      totalPedidos: Number(agregado._sum.totalCompras ?? 0),
    };
  }
}
