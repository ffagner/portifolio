/**
 * Dados gerais do site. Itens marcados como `null` dependem da F0
 * (ver docs/plano.md) e somem da interface enquanto não forem definidos.
 */
export const site = {
  nome: 'ffagner',
  papel: 'Dev Full-Stack · EdTech',
  tese: ['Software que faz a rede pública', 'enxergar seus alunos.'],
  descricao:
    'Dev Full-Stack EdTech. Produtos de avaliação, frequência escolar e gestão para redes públicas de ensino, com LGPD por padrão.',
  github: 'https://github.com/ffagner',
  linkedin: null as string | null,
  email: null as string | null,
};

export const nav = [
  { href: '/#fluxo', rotulo: 'Como funciona' },
  { href: '/#cases', rotulo: 'Cases' },
  { href: '/#projetos', rotulo: 'Projetos' },
  { href: '/#stack', rotulo: 'Stack' },
];

/** Conjuntos de cards do hero. Números tirados dos documentos dos repositórios. */
export const heroSets = [
  {
    chip: 'Escala',
    pergunta: 'Quantos alunos a rede consegue enxergar?',
    cards: [
      { k: 'Municípios', v: '~15', vivo: false },
      { k: 'Escolas na meta', v: '300', vivo: false },
      { k: 'Alunos', v: '30 mil', vivo: true },
      { k: 'Avaliações/ano', v: '~8', vivo: false },
    ],
  },
  {
    chip: 'Avaliações',
    pergunta: 'Quanto tempo do envio até o relatório?',
    cards: [
      { k: 'Gabarito', v: 'A–E', vivo: false },
      { k: 'Relatório', v: '~1 s', vivo: true },
      { k: 'Questões/caderno', v: '12–26', vivo: false },
      { k: 'Componentes', v: 'LP · MT', vivo: false },
    ],
  },
  {
    chip: 'Frequência',
    pergunta: 'Quando um aluno entra em risco de evasão?',
    cards: [
      { k: 'Piloto', v: '~20 escolas', vivo: false },
      { k: 'Alerta semanal', v: '3 faltas', vivo: true },
      { k: 'Alerta mensal', v: '8 faltas', vivo: false },
      { k: 'Perfis', v: 'SME · AE', vivo: false },
    ],
  },
];

export const ticker = [
  'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'NestJS', 'Edge Functions', 'Power BI', 'Firebase',
  'Recharts', 'LGPD por padrão', 'Multi-tenant', 'Avaliação diagnóstica', 'Frequência escolar', 'PDDE',
];

export const fluxo = [
  {
    titulo: 'Importar.',
    texto: 'O sistema do cliente exporta CSV. Não preciso de acesso ao banco dele.',
    chave: 'csv-importador',
    detalhe: 'Lê o arquivo, reconhece colunas e quantas questões o caderno tem.',
    meta: 'roda em localhost · nada sai da máquina',
    trilhas: ['CSV do cliente', 'Planilhas', 'Gabaritos em papel'],
  },
  {
    titulo: 'Validar.',
    texto: 'Erro some antes de virar gráfico: tipo, duplicado, aluno sem turma.',
    chave: 'supabase · área de trabalho',
    detalhe: 'Tabelas temporárias recebem só o que passou na validação.',
    meta: 'temporário · apagado no arquivamento',
    trilhas: ['Colunas', 'Duplicados', 'Turmas'],
  },
  {
    titulo: 'Snapshot.',
    texto: 'O resultado vira arquivo. Ele não muda depois de entregue.',
    chave: 'bucket privado',
    detalhe: 'Um JSON por escola, versionado, como registro permanente.',
    meta: 'download só com sessão autenticada',
    trilhas: ['Escola A', 'Escola B', 'Escola C'],
  },
  {
    titulo: 'Painel.',
    texto: 'A rede enxerga. O navegador calcula, o login decide o que cada um vê.',
    chave: 'painel de resultados',
    detalhe: 'Proficiência por escola, turma e questão, com impressão em A4.',
    meta: 'LGPD por padrão · sem link público',
    trilhas: ['Secretaria', 'Escola', 'Professor'],
  },
];

export const principios = [
  {
    rotulo: 'AD-3 · Painel de Resultados',
    titulo: 'LGPD por padrão',
    texto: 'Um arquivo por escola, entregue só a quem tem login. O que não chega ao navegador não vaza.',
  },
  {
    rotulo: 'AD-1 · Painel de Resultados',
    titulo: 'Arquivo, não consulta',
    texto: 'Resultado entregue não muda. Snapshot estático tira a carga do banco e vira o registro permanente.',
  },
  {
    rotulo: 'Arquitetura · EduPresença',
    titulo: 'Multi-tenant desde o dia 1',
    texto: 'O piloto tem cerca de 20 escolas. O modelo já nasce pronto para 300 escolas e 30 mil alunos.',
  },
];

export const stack = [
  { camada: 'Interface', itens: ['React', 'TypeScript', 'Vite', 'Tailwind', 'shadcn/ui', 'TanStack Query', 'Zustand', 'Zod'] },
  { camada: 'Back-end e dados', itens: ['Supabase', 'PostgreSQL', 'RLS', 'Edge Functions', 'NestJS', 'Firebase', 'Node'] },
  { camada: 'Relatórios', itens: ['Recharts', 'TanStack Table', 'jsPDF', 'pdf-lib', 'Papaparse', 'xlsx', 'Power BI'] },
];
