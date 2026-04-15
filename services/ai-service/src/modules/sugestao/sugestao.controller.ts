/**
 * Controller de Sugestões
 *
 * Rotas:
 * - POST   /sugestoes/resposta-marketplace
 * - POST   /sugestoes/descricao-produto
 * - POST   /sugestoes/preco
 * - POST   /sugestoes/titulo-anuncio
 * - GET    /sugestoes
 * - PUT    /sugestoes/:id/aceitar
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SugestaoService } from './sugestao.service';

@ApiTags('Sugestões')
@ApiBearerAuth()
@Controller('sugestoes')
export class SugestaoController {
  constructor(private service: SugestaoService) {}

  /**
   * Sugere resposta para pergunta de marketplace
   */
  @Post('resposta-marketplace')
  @ApiOperation({
    summary: 'Sugerir resposta',
    description: 'Gera resposta profissional para pergunta de cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta sugerida',
  })
  async sugerirResposta(
    @Request() req,
    @Body()
    dados: {
      perguntaId: string;
      pergunta: string;
      marketplace?: string;
    },
  ) {
    return this.service.sugerirRespostaMarketplace(
      req.tenantId,
      dados.perguntaId,
      dados.pergunta,
      { marketplace: dados.marketplace },
    );
  }

  /**
   * Gera descrição otimizada de produto
   */
  @Post('descricao-produto')
  @ApiOperation({
    summary: 'Gerar descrição',
    description: 'Cria descrição otimizada para produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Descrição gerada',
  })
  async gerarDescricao(
    @Request() req,
    @Body()
    dados: {
      produtoId: string;
      nome: string;
      categoria: string;
      caracteristicas: string[];
      palavrasChave?: string[];
    },
  ) {
    return this.service.gerarDescricaoProduto(
      req.tenantId,
      dados.produtoId,
      {
        nome: dados.nome,
        categoria: dados.categoria,
        caracteristicas: dados.caracteristicas,
        palavrasChave: dados.palavrasChave,
      },
    );
  }

  /**
   * Sugere preço para produto
   */
  @Post('preco')
  @ApiOperation({
    summary: 'Sugerir preço',
    description: 'Calcula preço sugerido baseado em custo e mercado',
  })
  @ApiResponse({
    status: 200,
    description: 'Preço sugerido',
  })
  async sugerirPreco(
    @Request() req,
    @Body()
    dados: {
      produtoId: string;
      custoUnitario: number;
      margemDesejada?: number;
    },
  ) {
    return this.service.sugerirPreco(
      req.tenantId,
      dados.produtoId,
      dados.custoUnitario,
      dados.margemDesejada || 0.3,
    );
  }

  /**
   * Gera título otimizado para anúncio
   */
  @Post('titulo-anuncio')
  @ApiOperation({
    summary: 'Gerar título',
    description: 'Cria título otimizado para marketplace',
  })
  @ApiResponse({
    status: 200,
    description: 'Título gerado',
  })
  async gerarTitulo(
    @Request() req,
    @Body()
    dados: {
      produtoId: string;
      nome: string;
      categoria: string;
      marketplace: 'MERCADO_LIVRE' | 'AMAZON' | 'SHOPEE' | 'PRÓPRIO';
      destaque?: string;
    },
  ) {
    return this.service.sugerirTituloAnuncio(
      req.tenantId,
      dados.produtoId,
      dados.marketplace,
      {
        nome: dados.nome,
        categoria: dados.categoria,
        destaque: dados.destaque,
      },
    );
  }

  /**
   * Lista sugestões
   */
  @Get()
  @ApiOperation({
    summary: 'Listar sugestões',
    description: 'Retorna sugestões geradas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sugestões',
  })
  async listar(
    @Request() req,
    @Query('tipo') tipo?: string,
    @Query('aceita') aceita?: boolean,
    @Query('pagina') pagina: number = 0,
    @Query('limite') limite: number = 20,
  ) {
    return this.service.listarSugestoes(req.tenantId, {
      tipo,
      aceita,
      limite,
      offset: pagina * limite,
    });
  }

  /**
   * Marca sugestão como aceita
   */
  @Put(':id/aceitar')
  @ApiOperation({
    summary: 'Aceitar sugestão',
    description: 'Registra que o usuário aceitou uma sugestão',
  })
  @ApiResponse({
    status: 200,
    description: 'Sugestão aceita',
  })
  async aceitar(@Param('id') sugestaoId: string) {
    return this.service.aceitarSugestao('tenant-id', sugestaoId);
  }
}
