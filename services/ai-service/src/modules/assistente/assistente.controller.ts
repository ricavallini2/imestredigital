/**
 * Controller Assistente - Endpoints HTTP
 *
 * Rotas:
 * - POST   /assistente/conversas
 * - GET    /assistente/conversas
 * - GET    /assistente/conversas/:id
 * - POST   /assistente/conversas/:id/mensagens
 * - POST   /assistente/comando
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AssistenteService } from './assistente.service';
import { IniciarConversaDTO } from './dtos/iniciar-conversa.dto';
import { EnviarMensagemDTO } from './dtos/enviar-mensagem.dto';
import { ComandoRapidoDTO } from './dtos/comando-rapido.dto';

@ApiTags('Assistente')
@ApiBearerAuth()
@Controller('assistente')
export class AssistenteController {
  constructor(private service: AssistenteService) {}

  /**
   * Inicia uma nova conversa com o iMestreAI
   */
  @Post('conversas')
  @ApiOperation({
    summary: 'Iniciar nova conversa',
    description: 'Abre uma nova sessão de chat com o assistente IA',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversa criada com sucesso',
    schema: {
      example: {
        id: 'conv-123',
        tenantId: 'tenant-001',
        usuarioId: 'user-456',
        titulo: 'Análise de estoque',
        contexto: { modulo: 'estoque' },
        criadoEm: '2024-03-23T10:00:00Z',
      },
    },
  })
  async iniciarConversa(
    @Request() req,
    @Body() dados: IniciarConversaDTO,
  ) {
    const tenantId = req.tenantId;
    const usuarioId = req.usuarioId || 'usuario-anonimo';

    if (!tenantId) {
      throw new BadRequestException('tenantId inválido ou ausente');
    }

    return this.service.iniciarConversa(tenantId, usuarioId, dados);
  }

  /**
   * Lista conversas do usuário autenticado
   */
  @Get('conversas')
  @ApiOperation({
    summary: 'Listar conversas',
    description: 'Retorna histórico de conversas do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conversas',
    schema: {
      example: {
        conversas: [
          {
            id: 'conv-1',
            titulo: 'Análise de vendas',
            atualizadoEm: '2024-03-23T10:00:00Z',
          },
        ],
        total: 5,
        pagina: 0,
      },
    },
  })
  async listarConversas(
    @Request() req,
    @Query('pagina') pagina: number = 0,
    @Query('limite') limite: number = 20,
  ) {
    const tenantId = req.tenantId;
    const usuarioId = req.usuarioId || 'usuario-anonimo';

    return this.service.listarConversas(tenantId, usuarioId, pagina, limite);
  }

  /**
   * Obtém uma conversa específica com seu histórico
   */
  @Get('conversas/:id')
  @ApiOperation({
    summary: 'Obter conversa',
    description: 'Retorna uma conversa específica com todo seu histórico',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversa encontrada',
    schema: {
      example: {
        id: 'conv-123',
        titulo: 'Análise de estoque',
        mensagens: [
          {
            id: 'msg-1',
            papel: 'USUARIO',
            conteudo: 'Qual é meu estoque?',
            criadoEm: '2024-03-23T10:00:00Z',
          },
          {
            id: 'msg-2',
            papel: 'ASSISTENTE',
            conteudo: 'Seu estoque atual é...',
            criadoEm: '2024-03-23T10:00:01Z',
          },
        ],
      },
    },
  })
  async obterConversa(
    @Request() req,
    @Param('id') conversaId: string,
  ) {
    const tenantId = req.tenantId;

    return this.service.obterConversa(tenantId, conversaId);
  }

  /**
   * Envia uma mensagem em uma conversa existente
   */
  @Post('conversas/:id/mensagens')
  @ApiOperation({
    summary: 'Enviar mensagem',
    description: 'Envia uma mensagem e recebe resposta da IA',
  })
  @ApiResponse({
    status: 200,
    description: 'Resposta gerada com sucesso',
    schema: {
      example: {
        respostaAssistente: 'Seu estoque de produto X é 50 unidades...',
        metadados: {
          tokensUsados: 240,
          tempoMs: 1250,
          custo: 0.0045,
        },
      },
    },
  })
  async enviarMensagem(
    @Request() req,
    @Param('id') conversaId: string,
    @Body() dados: EnviarMensagemDTO,
  ) {
    const tenantId = req.tenantId;

    if (!conversaId) {
      throw new BadRequestException('conversaId inválido');
    }

    return this.service.enviarMensagem(tenantId, conversaId, dados);
  }

  /**
   * Executa um comando rápido sem conversa
   */
  @Post('comando')
  @ApiOperation({
    summary: 'Executar comando',
    description: 'Processa um comando em linguagem natural sem histórico de conversa',
  })
  @ApiResponse({
    status: 200,
    description: 'Comando executado',
    schema: {
      example: {
        comando: 'qual é meu faturamento de hoje?',
        resposta: 'Seu faturamento de hoje foi R$ 5.432,00...',
        metadados: {
          tokensUsados: 150,
          tempoMs: 800,
          custo: 0.002,
        },
      },
    },
  })
  async executarComando(
    @Request() req,
    @Body() dados: ComandoRapidoDTO,
  ) {
    const tenantId = req.tenantId;
    const usuarioId = req.usuarioId || 'usuario-anonimo';

    return this.service.processarComando(tenantId, usuarioId, dados);
  }
}
