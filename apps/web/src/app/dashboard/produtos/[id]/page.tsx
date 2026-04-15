'use client';

/**
 * Página de Edição de Produto
 * Mesmo formulário da criação, mas com dados preenchidos
 */

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2, Upload, Info } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Tabs } from '@/components/ui/tabs';

// Dados mock para produto existente
const produtoMock = {
  nome: 'iPhone 15 Pro',
  descricao: 'Smartphone de última geração com processador A17 Pro, câmera avançada e design premium.',
  sku: 'APL-IP15P-256',
  marca: 'Apple',
  categoria: 'Eletrônicos',
  preco: '7999.00',
  precoPromocional: '7499.00',
  peso: '187',
  altura: '146.6',
  largura: '70.6',
  profundidade: '8.25',
  metaDescricao: 'Compre iPhone 15 Pro. Tecnologia de ponta, câmera profissional.',
  metaPalavrasChave: 'iPhone, Apple, smartphone, 5G',
  ncm: '85171200',
  cfop: '5102',
};

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id;

  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome: produtoMock.nome,
    descricao: produtoMock.descricao,
    sku: produtoMock.sku,
    marca: produtoMock.marca,
    categoria: produtoMock.categoria,
    preco: produtoMock.preco,
    precoPromocional: produtoMock.precoPromocional,
    peso: produtoMock.peso,
    altura: produtoMock.altura,
    largura: produtoMock.largura,
    profundidade: produtoMock.profundidade,
    imagens: [] as File[],
    metaDescricao: produtoMock.metaDescricao,
    metaPalavrasChave: produtoMock.metaPalavrasChave,
    ncm: produtoMock.ncm,
    cfop: produtoMock.cfop,
  });

  const [variacoes, setVariacoes] = useState([
    { id: '1', tipo: 'Cor', valor: 'Preto' },
    { id: '2', tipo: 'Capacidade', valor: '256GB' },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVariacao = () => {
    setVariacoes((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        tipo: 'Cor',
        valor: '',
      },
    ]);
  };

  const handleRemoveVariacao = (id: string) => {
    setVariacoes((prev) => prev.filter((v) => v.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        imagens: [...prev.imagens, ...Array.from(files)],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    // Simulação de salvamento
    setTimeout(() => {
      router.push('/dashboard/produtos');
      setSalvando(false);
    }, 1500);
  };

  const abasConteudo = [
    {
      id: 'basico',
      label: 'Informações Básicas',
      content: (
        <div className="space-y-4">
          <FormField
            name="nome"
            label="Nome do Produto"
            placeholder="Ex: iPhone 15 Pro"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Descrição
              <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              name="descricao"
              placeholder="Descreva as características e detalhes do produto..."
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="sku"
              label="SKU"
              placeholder="APL-IP15P-256"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
            <FormField
              name="marca"
              label="Marca"
              placeholder="Ex: Apple"
              value={formData.marca}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Categoria
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Armazenamento">Armazenamento</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'variacoes',
      label: 'Variações',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Info className="h-4 w-4" />
              Adicione variações como cor, tamanho, capacidade, etc.
            </div>
          </div>

          <div className="space-y-3">
            {variacoes.map((variacao) => (
              <div key={variacao.id} className="flex gap-3">
                <select
                  value={variacao.tipo}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                >
                  <option value="Cor">Cor</option>
                  <option value="Tamanho">Tamanho</option>
                  <option value="Capacidade">Capacidade</option>
                  <option value="Versão">Versão</option>
                </select>
                <input
                  type="text"
                  placeholder="Ex: Preto, P, 64GB"
                  value={variacao.valor}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
                />
                <button
                  onClick={() => handleRemoveVariacao(variacao.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddVariacao}
            className="flex items-center gap-2 rounded-lg border border-marca-300 px-3 py-2 text-sm font-medium text-marca-600 hover:bg-marca-50 dark:border-marca-700 dark:text-marca-400 dark:hover:bg-marca-900/20"
          >
            <Plus className="h-4 w-4" />
            Adicionar Variação
          </button>
        </div>
      ),
    },
    {
      id: 'precos',
      label: 'Preços',
      content: (
        <div className="space-y-4">
          <FormField
            name="preco"
            label="Preço de Venda"
            placeholder="0.00"
            type="number"
            inputMode="decimal"
            step="0.01"
            value={formData.preco}
            onChange={handleInputChange}
            required
          />

          <FormField
            name="precoPromocional"
            label="Preço Promocional (opcional)"
            placeholder="0.00"
            type="number"
            inputMode="decimal"
            step="0.01"
            value={formData.precoPromocional}
            onChange={handleInputChange}
            hint="Deixe em branco se não houver promoção"
          />

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Resumo de Preços
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Preço de Venda:</span>
                <span className="font-semibold">
                  R$ {formData.preco ? Number(formData.preco).toFixed(2) : '0.00'}
                </span>
              </div>
              {formData.precoPromocional && (
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Promoção:</span>
                  <span className="font-semibold text-destaque-500">
                    R$ {Number(formData.precoPromocional).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'imagens',
      label: 'Imagens',
      content: (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
            <div className="flex justify-center">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Arraste imagens aqui ou clique para upload
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Até 5 imagens. JPG, PNG até 10MB
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="mt-4 inline-block cursor-pointer rounded-lg bg-marca-500 px-4 py-2 text-sm font-medium text-white hover:bg-marca-600"
            >
              Selecionar Imagens
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'seo',
      label: 'SEO',
      content: (
        <div className="space-y-4">
          <FormField
            name="metaDescricao"
            label="Meta Descrição"
            placeholder="Descrição para buscadores (até 160 caracteres)"
            value={formData.metaDescricao}
            onChange={handleInputChange}
            hint="Aparece nos resultados de busca"
          />

          <FormField
            name="metaPalavrasChave"
            label="Palavras-chave"
            placeholder="Ex: iPhone, Apple, smartphone, 5G"
            value={formData.metaPalavrasChave}
            onChange={handleInputChange}
            hint="Separadas por vírgula"
          />
        </div>
      ),
    },
    {
      id: 'fiscal',
      label: 'Fiscal',
      content: (
        <div className="space-y-4">
          <FormField
            name="ncm"
            label="NCM (Nomenclatura Comum do Mercosul)"
            placeholder="Ex: 85171200"
            value={formData.ncm}
            onChange={handleInputChange}
            required
          />

          <FormField
            name="cfop"
            label="CFOP (Código Fiscal de Operação)"
            placeholder="Ex: 5102"
            value={formData.cfop}
            onChange={handleInputChange}
            required
          />

          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>NCM</strong> e <strong>CFOP</strong> são obrigatórios para emissão
              de notas fiscais. Consulte a tabela de códigos se necessário.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Editar Produto
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {formData.nome}
            </p>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={salvando}
          className="flex items-center gap-2 rounded-lg bg-destaque-500 px-4 py-2.5 font-semibold text-white hover:bg-destaque-600 disabled:opacity-50 transition-colors dark:bg-destaque-600"
        >
          <Save className="h-5 w-5" />
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Formulário com Abas */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <form>
          <Tabs tabs={abasConteudo} />
        </form>
      </div>
    </div>
  );
}
