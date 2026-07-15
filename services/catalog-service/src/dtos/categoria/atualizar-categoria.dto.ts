/**
 * DTO para atualização de categoria.
 *
 * Todos os campos são opcionais (atualização parcial). Herda as validações
 * do DTO de criação via PartialType.
 */

import { PartialType } from '@nestjs/swagger'

import { CriarCategoriaDto } from './criar-categoria.dto'

export class AtualizarCategoriaDto extends PartialType(CriarCategoriaDto) {}
