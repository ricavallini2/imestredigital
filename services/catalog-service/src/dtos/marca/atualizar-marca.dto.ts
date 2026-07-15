/**
 * DTO para atualização de marca.
 *
 * Todos os campos são opcionais (atualização parcial). Herda as validações
 * do DTO de criação via PartialType.
 */

import { PartialType } from '@nestjs/swagger'

import { CriarMarcaDto } from './criar-marca.dto'

export class AtualizarMarcaDto extends PartialType(CriarMarcaDto) {}
