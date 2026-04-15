import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '@/services/clientes.service';
import type {
  FiltrosCliente,
  CriarClienteDto,
  RegistrarInteracaoDto,
  Endereco,
  Contato,
} from '@/types';

// ─── Listagem ───────────────────────────────────────────────────────────────

export function useClientes(filtros?: FiltrosCliente) {
  return useQuery({
    queryKey: ['clientes', filtros],
    queryFn: () => clientesService.listar(filtros),
  });
}

export function useCliente(id: string) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: () => clientesService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useClienteResumo(id: string) {
  return useQuery({
    queryKey: ['cliente', id, 'resumo'],
    queryFn: () => clientesService.obterResumo(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useEstatisticasClientes() {
  return useQuery({
    queryKey: ['clientes', 'estatisticas'],
    queryFn: () => clientesService.obterEstatisticas(),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutations básicas ──────────────────────────────────────────────────────

export function useCriarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarClienteDto) => clientesService.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useAtualizarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<CriarClienteDto> }) =>
      clientesService.atualizar(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', id] });
    },
  });
}

export function useInativarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientesService.inativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

// ─── Timeline / Interações ──────────────────────────────────────────────────

export function useClienteTimeline(clienteId: string) {
  return useQuery({
    queryKey: ['cliente', clienteId, 'timeline'],
    queryFn: () => clientesService.obterTimeline(clienteId),
    enabled: !!clienteId,
  });
}

export function useRegistrarInteracao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, dto }: { clienteId: string; dto: RegistrarInteracaoDto }) =>
      clientesService.registrarInteracao(clienteId, dto),
    onSuccess: (_, { clienteId }) => {
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId, 'timeline'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId] });
    },
  });
}

// ─── Endereços ──────────────────────────────────────────────────────────────

export function useClienteEnderecos(clienteId: string) {
  return useQuery({
    queryKey: ['cliente', clienteId, 'enderecos'],
    queryFn: () => clientesService.listarEnderecos(clienteId),
    enabled: !!clienteId,
  });
}

export function useCriarEndereco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, dto }: { clienteId: string; dto: Omit<Endereco, 'id'> }) =>
      clientesService.criarEndereco(clienteId, dto),
    onSuccess: (_, { clienteId }) => {
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId, 'enderecos'] });
    },
  });
}

export function useRemoverEndereco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, enderecoId }: { clienteId: string; enderecoId: string }) =>
      clientesService.removerEndereco(clienteId, enderecoId),
    onSuccess: (_, { clienteId }) => {
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId, 'enderecos'] });
    },
  });
}

// ─── Contatos ───────────────────────────────────────────────────────────────

export function useClienteContatos(clienteId: string) {
  return useQuery({
    queryKey: ['cliente', clienteId, 'contatos'],
    queryFn: () => clientesService.listarContatos(clienteId),
    enabled: !!clienteId,
  });
}

export function useCriarContato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, dto }: { clienteId: string; dto: Omit<Contato, 'id'> }) =>
      clientesService.criarContato(clienteId, dto),
    onSuccess: (_, { clienteId }) => {
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId, 'contatos'] });
    },
  });
}

export function useRemoverContato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, contatoId }: { clienteId: string; contatoId: string }) =>
      clientesService.removerContato(clienteId, contatoId),
    onSuccess: (_, { clienteId }) => {
      queryClient.invalidateQueries({ queryKey: ['cliente', clienteId, 'contatos'] });
    },
  });
}

// ─── Análise IA ─────────────────────────────────────────────────────────────

export function useAnaliseIA(clienteId: string) {
  const { data: cliente } = useCliente(clienteId);
  const { data: resumo } = useClienteResumo(clienteId);

  return useQuery({
    queryKey: ['cliente', clienteId, 'analise-ia'],
    queryFn: () => clientesService.analisarComIA(cliente!, resumo),
    enabled: !!cliente,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}
