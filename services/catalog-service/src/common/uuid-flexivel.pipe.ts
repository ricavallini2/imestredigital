/**
 * Pipe de validação de UUID no formato genérico (8-4-4-4-12 hex).
 *
 * O projeto usa UUIDs FIXOS determinísticos nos seeds (ex.:
 * '60000000-0000-0000-0000-000000000004'), cujo dígito de versão é 0.
 * O ParseUUIDPipe do Nest e o @IsUUID do class-validator delegam ao
 * validator.js, que exige versão 1-8 — rejeitando os IDs dos seeds.
 * Este pipe valida apenas o FORMATO, mantendo a proteção contra P2023
 * do Prisma (string arbitrária em coluna @db.Uuid) sem quebrar os seeds.
 */

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export const UUID_GENERICO_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class UuidFlexivelPipe implements PipeTransform<string, string> {
  transform(valor: string): string {
    if (!UUID_GENERICO_REGEX.test(valor ?? '')) {
      throw new BadRequestException('Identificador inválido (esperado UUID)');
    }
    return valor;
  }
}
