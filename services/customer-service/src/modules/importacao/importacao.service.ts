/**
 * Serviço de Importação de Clientes
 *
 * Gerencia importação em lote de clientes a partir de CSV/XLSX.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImportarClientesDto } from '@/dtos/importacao/importar-clientes.dto';
import { ImportacaoCliente } from '../../../generated/client';

@Injectable()
export class ImportacaoService {
  private readonly logger = new Logger(ImportacaoService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Inicia importação de clientes
   */
  async iniciarImportacao(
    tenantId: string,
    usuarioId: string,
    dto: ImportarClientesDto,
  ): Promise<ImportacaoCliente> {
    const importacao = await this.prisma.importacaoCliente.create({
      data: {
        tenantId,
        arquivo: dto.arquivo,
        formato: dto.formato,
        status: 'PENDENTE',
        totalRegistros: 0,
        usuarioId,
      },
    });

    this.logger.log(`Importação ${importacao.id} iniciada para tenant ${tenantId}`);

    // Em um ambiente real, aqui seria disparado um job/event para processar o arquivo
    // Por exemplo: await this.eventEmitter.emit('importacao.iniciada', { importacaoId });

    return importacao;
  }

  /**
   * Obtém status da importação
   */
  async obterStatus(tenantId: string, importacaoId: string): Promise<ImportacaoCliente | null> {
    return this.prisma.importacaoCliente.findFirst({
      where: { id: importacaoId, tenantId },
    });
  }

  /**
   * Lista importações do tenant
   */
  async listarImportacoes(tenantId: string, pagina: number = 1, limite: number = 20) {
    const skip = (pagina - 1) * limite;

    const [importacoes, total] = await Promise.all([
      this.prisma.importacaoCliente.findMany({
        where: { tenantId },
        skip,
        take: limite,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.importacaoCliente.count({ where: { tenantId } }),
    ]);

    return {
      importacoes,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  /**
   * Processa arquivo de importação (stub - implementação real dependeria de biblioteca CSV/XLSX)
   */
  async processarArquivo(tenantId: string, importacaoId: string): Promise<void> {
    const importacao = await this.prisma.importacaoCliente.findFirst({
      where: { id: importacaoId, tenantId },
    });

    if (!importacao) {
      throw new Error('Importação não encontrada');
    }

    // Atualiza status para PROCESSANDO
    await this.prisma.importacaoCliente.update({
      where: { id: importacaoId },
      data: { status: 'PROCESSANDO' },
    });

    try {
      // Aqui seria implementado o parsing e validação do arquivo
      // Para exemplo, apenas marcamos como concluído
      await this.prisma.importacaoCliente.update({
        where: { id: importacaoId },
        data: {
          status: 'CONCLUIDO',
          concluidoEm: new Date(),
          importados: 0,
          erros: 0,
        },
      });

      this.logger.log(`Importação ${importacaoId} concluída`);
    } catch (erro) {
      this.logger.error(`Erro ao processar importação ${importacaoId}:`, erro);

      await this.prisma.importacaoCliente.update({
        where: { id: importacaoId },
        data: {
          status: 'ERRO',
          logErros: { erro: erro.message },
        },
      });
    }
  }
}
