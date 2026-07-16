/**
 * Hooks React Query do cadastro de usuários e permissões.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  usuariosService,
  type CriarUsuarioDTO,
  type AtualizarUsuarioDTO,
  type PermissaoModulo,
} from '@/services/usuarios.service';

const CHAVE = ['usuarios'];

export function useUsuarios() {
  return useQuery({
    queryKey: CHAVE,
    queryFn: () => usuariosService.listar(),
    staleTime: 60 * 1000,
  });
}

/** Catálogo de módulos/ações (estável — cache longo). */
export function useCatalogoPermissoes() {
  return useQuery({
    queryKey: [...CHAVE, 'catalogo'],
    queryFn: () => usuariosService.obterCatalogo(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useUsuario(id?: string) {
  return useQuery({
    queryKey: [...CHAVE, id],
    queryFn: () => usuariosService.obterPorId(id!),
    enabled: !!id,
  });
}

/** Perfil + permissões do usuário logado (base para liberar/ocultar ações na UI). */
export function useMeuPerfil() {
  return useQuery({
    queryKey: [...CHAVE, 'me'],
    queryFn: () => usuariosService.obterMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useCriarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarUsuarioDTO) => usuariosService.criar(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useAtualizarUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AtualizarUsuarioDTO }) =>
      usuariosService.atualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useDefinirPermissoes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissoes }: { id: string; permissoes: PermissaoModulo[] }) =>
      usuariosService.definirPermissoes(id, permissoes),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useRemoverUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usuariosService.remover(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}
