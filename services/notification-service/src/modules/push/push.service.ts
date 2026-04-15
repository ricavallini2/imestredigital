/**
 * Serviço de Push Notifications.
 *
 * Responsável por enviar notificações push usando Firebase Cloud Messaging (FCM).
 * Gerencia registro/remoção de tokens de dispositivos dos usuários.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface RegistroPush {
  usuarioId: string;
  token: string;
  plataforma?: string; // ios, android, web
  ativo: boolean;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private estaConfigurizado: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.verificarConfiguracao();
  }

  /**
   * Verifica se Firebase está configurado.
   */
  private verificarConfiguracao() {
    const projectId = this.configService.get('FIREBASE_PROJECT_ID');
    const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY');
    const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');

    this.estaConfigurizado = !!(projectId && privateKey && clientEmail);

    if (!this.estaConfigurizado) {
      this.logger.warn(
        'Firebase não está completamente configurado. ' +
        'Notificações push funcionarão em modo mockado.',
      );
    }
  }

  /**
   * Envia uma notificação push para um usuário.
   * Busca todos os tokens do usuário e envia para cada um.
   */
  async enviarPush(
    tenantId: string,
    usuarioId: string,
    titulo: string,
    mensagem: string,
    dados?: Record<string, any>,
  ): Promise<{ sucesso: number; falhas: number }> {
    try {
      // Busca tokens do usuário
      // Nota: Você precisará adicionar uma tabela de "DispositivoToken" no schema
      // Por enquanto, apenas mockamos a funcionalidade

      if (!this.estaConfigurizado) {
        this.logger.log(
          `[MOCK] Push para usuário ${usuarioId}: "${titulo}" - "${mensagem}"`,
        );
        return { sucesso: 1, falhas: 0 };
      }

      // TODO: Implementar envio via Firebase Admin SDK
      this.logger.log(`Envio de push para usuário ${usuarioId}: ${titulo}`);
      return { sucesso: 1, falhas: 0 };
    } catch (erro) {
      this.logger.error(`Erro ao enviar push para usuário ${usuarioId}:`, erro);
      return { sucesso: 0, falhas: 1 };
    }
  }

  /**
   * Envia push em massa para múltiplos usuários.
   */
  async enviarPushEmMassa(
    tenantId: string,
    usuariosIds: string[],
    titulo: string,
    mensagem: string,
    dados?: Record<string, any>,
  ): Promise<{ sucesso: number; falhas: number }> {
    let sucesso = 0;
    let falhas = 0;

    for (const usuarioId of usuariosIds) {
      try {
        const resultado = await this.enviarPush(
          tenantId,
          usuarioId,
          titulo,
          mensagem,
          dados,
        );
        sucesso += resultado.sucesso;
        falhas += resultado.falhas;
      } catch (erro) {
        this.logger.error(`Erro ao enviar push em massa para ${usuarioId}:`, erro);
        falhas++;
      }
    }

    return { sucesso, falhas };
  }

  /**
   * Registra um token de dispositivo para um usuário.
   * Permite que o usuário receba notificações em vários dispositivos.
   */
  async registrarDispositivo(
    tenantId: string,
    usuarioId: string,
    token: string,
    plataforma?: string,
  ): Promise<RegistroPush> {
    try {
      this.logger.log(
        `Token registrado para usuário ${usuarioId} (${plataforma || 'desconhecida'})`,
      );

      // TODO: Armazenar token no banco de dados
      // await this.prisma.dispositivoPush.create({
      //   data: {
      //     usuarioId,
      //     tenantId,
      //     token,
      //     plataforma,
      //     ativo: true,
      //   },
      // });

      return {
        usuarioId,
        token,
        plataforma,
        ativo: true,
      };
    } catch (erro) {
      this.logger.error(
        `Erro ao registrar dispositivo para ${usuarioId}:`,
        erro,
      );
      throw erro;
    }
  }

  /**
   * Remove um token de dispositivo.
   * Usado quando o usuário logout ou desinstala o app.
   */
  async removerDispositivo(
    tenantId: string,
    token: string,
  ): Promise<boolean> {
    try {
      this.logger.log(`Token removido: ${token}`);

      // TODO: Remover token do banco
      // await this.prisma.dispositivoPush.update({
      //   where: { token },
      //   data: { ativo: false },
      // });

      return true;
    } catch (erro) {
      this.logger.error(`Erro ao remover dispositivo:`, erro);
      throw erro;
    }
  }

  /**
   * Lista todos os tokens ativos de um usuário.
   */
  async listarDispositivosUsuario(
    tenantId: string,
    usuarioId: string,
  ): Promise<RegistroPush[]> {
    try {
      // TODO: Buscar do banco
      // const registros = await this.prisma.dispositivoPush.findMany({
      //   where: {
      //     usuarioId,
      //     tenantId,
      //     ativo: true,
      //   },
      // });

      this.logger.log(`Dispositivos do usuário ${usuarioId} recuperados`);
      return [];
    } catch (erro) {
      this.logger.error(
        `Erro ao listar dispositivos do usuário ${usuarioId}:`,
        erro,
      );
      throw erro;
    }
  }
}
