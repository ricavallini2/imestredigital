/**
 * Serviço de Templates de Notificação.
 *
 * Gerencia templates reutilizáveis de notificações com Handlebars.
 * Suporta preview/renderização de templates com variáveis.
 */

import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CriarTemplateDto, AtualizarTemplateDto } from '../../dtos/criar-template.dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Cria um novo template.
   */
  async criar(tenantId: string, dto: CriarTemplateDto): Promise<any> {
    try {
      // Valida se slug já existe
      const existente = await this.prisma.templateNotificacao.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug: dto.slug,
          },
        },
      });

      if (existente) {
        throw new Error(`Template com slug "${dto.slug}" já existe`);
      }

      // Compila o template para validar sintaxe Handlebars
      try {
        Handlebars.compile(dto.conteudo);
      } catch (erro) {
        throw new Error(`Erro na sintaxe Handlebars do conteúdo: ${(erro as any).message}`);
      }

      if (dto.assunto) {
        try {
          Handlebars.compile(dto.assunto);
        } catch (erro) {
          throw new Error(`Erro na sintaxe Handlebars do assunto: ${(erro as any).message}`);
        }
      }

      const template = await this.prisma.templateNotificacao.create({
        data: {
          tenantId,
          nome: dto.nome,
          slug: dto.slug,
          tipo: dto.tipo,
          assunto: dto.assunto,
          conteudo: dto.conteudo,
          variaveis: dto.variaveis,
          ativo: dto.ativo ?? true,
        },
      });

      this.logger.log(`Template criado: ${template.slug}`);
      return template;
    } catch (erro) {
      this.logger.error('Erro ao criar template:', erro);
      throw erro;
    }
  }

  /**
   * Lista todos os templates de um tenant.
   */
  async listar(tenantId: string): Promise<any[]> {
    try {
      const templates = await this.prisma.templateNotificacao.findMany({
        where: { tenantId },
        orderBy: { criadoEm: 'desc' },
      });

      return templates;
    } catch (erro) {
      this.logger.error('Erro ao listar templates:', erro);
      throw erro;
    }
  }

  /**
   * Busca um template por slug.
   */
  async buscarPorSlug(tenantId: string, slug: string): Promise<any> {
    try {
      const chaveCache = `template:${tenantId}:${slug}`;

      // Tenta cache
      const cacheado = await this.cache.obter<any>(chaveCache);
      if (cacheado) {
        return cacheado;
      }

      const template = await this.prisma.templateNotificacao.findUnique({
        where: {
          tenantId_slug: {
            tenantId,
            slug,
          },
        },
      });

      if (!template) {
        throw new Error(`Template ${slug} não encontrado`);
      }

      // Armazena no cache por 1 hora
      await this.cache.armazenar(chaveCache, template, 3600);

      return template;
    } catch (erro) {
      this.logger.error('Erro ao buscar template por slug:', erro);
      throw erro;
    }
  }

  /**
   * Atualiza um template existente.
   */
  async atualizar(
    tenantId: string,
    slug: string,
    dto: AtualizarTemplateDto,
  ): Promise<any> {
    try {
      // Validações de Handlebars se campos forem atualizados
      if (dto.conteudo) {
        try {
          Handlebars.compile(dto.conteudo);
        } catch (erro) {
          throw new Error(`Erro na sintaxe Handlebars do conteúdo: ${(erro as any).message}`);
        }
      }

      if (dto.assunto) {
        try {
          Handlebars.compile(dto.assunto);
        } catch (erro) {
          throw new Error(`Erro na sintaxe Handlebars do assunto: ${(erro as any).message}`);
        }
      }

      const template = await this.prisma.templateNotificacao.update({
        where: {
          tenantId_slug: {
            tenantId,
            slug,
          },
        },
        data: {
          ...(dto.nome && { nome: dto.nome }),
          ...(dto.assunto !== undefined && { assunto: dto.assunto }),
          ...(dto.conteudo && { conteudo: dto.conteudo }),
          ...(dto.variaveis && { variaveis: dto.variaveis }),
          ...(dto.ativo !== undefined && { ativo: dto.ativo }),
        },
      });

      // Limpa cache
      await this.cache.remover(`template:${tenantId}:${slug}`);

      this.logger.log(`Template atualizado: ${slug}`);
      return template;
    } catch (erro) {
      this.logger.error('Erro ao atualizar template:', erro);
      throw erro;
    }
  }

  /**
   * Renderiza (compila) um template com variáveis.
   */
  async renderizar(
    tenantId: string,
    slug: string,
    variaveis: Record<string, any>,
  ): Promise<{
    assunto?: string;
    conteudo: string;
    erros?: string[];
  }> {
    try {
      const template = await this.buscarPorSlug(tenantId, slug);

      const erros: string[] = [];

      // Valida se todas as variáveis esperadas foram fornecidas
      const variaveisEsperadas = template.variaveis as string[];
      const variaveisFornecidas = Object.keys(variaveis);

      for (const varEsperada of variaveisEsperadas) {
        if (!variaveisFornecidas.includes(varEsperada)) {
          erros.push(`Variável esperada não fornecida: ${varEsperada}`);
        }
      }

      // Se há erros, retorna com aviso
      if (erros.length > 0) {
        this.logger.warn(`Erros de variáveis no template ${slug}:`, erros);
      }

      // Compila e renderiza
      const templateCompilado = Handlebars.compile(template.conteudo);
      const conteudoRenderizado = templateCompilado(variaveis);

      let assuntoRenderizado: string | undefined;
      if (template.assunto) {
        const assuntoCompilado = Handlebars.compile(template.assunto);
        assuntoRenderizado = assuntoCompilado(variaveis);
      }

      const resultado: any = {
        conteudo: conteudoRenderizado,
      };

      if (assuntoRenderizado) {
        resultado.assunto = assuntoRenderizado;
      }

      if (erros.length > 0) {
        resultado.erros = erros;
      }

      return resultado;
    } catch (erro) {
      this.logger.error('Erro ao renderizar template:', erro);
      throw erro;
    }
  }

  /**
   * Deleta um template.
   */
  async deletar(tenantId: string, slug: string): Promise<boolean> {
    try {
      await this.prisma.templateNotificacao.delete({
        where: {
          tenantId_slug: {
            tenantId,
            slug,
          },
        },
      });

      // Limpa cache
      await this.cache.remover(`template:${tenantId}:${slug}`);

      this.logger.log(`Template deletado: ${slug}`);
      return true;
    } catch (erro) {
      this.logger.error('Erro ao deletar template:', erro);
      throw erro;
    }
  }
}
