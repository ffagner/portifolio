/** Nós do grafo "Uma rede de ensino. Um modelo conectado." Posições em % da área do grafo. */
export interface No {
  id: string;
  sigla: string;
  nome: string;
  sub: string;
  x: number;
  y: number;
  numero: string;
  unidade: string;
  texto: string;
  stack: [string, string][];
  caso?: string;
}

export const nos: No[] = [
  { id: 'rs', sigla: 'RS', nome: 'Resultados', sub: 'painel · snapshots', x: 22, y: 20, numero: '~15', unidade: 'municípios', texto: 'Avaliações diagnósticas publicadas sem expor dado nominal.', stack: [['React + Vite', 'front'], ['Supabase Storage', 'privado'], ['jsPDF', 'relatórios']], caso: 'resultados-sem-vazamento' },
  { id: 'av', sigla: 'AV', nome: 'Avaliações', sub: 'answer-sheets', x: 80, y: 16, numero: '~1 s', unidade: 'até o relatório', texto: 'Gabaritos digitais e proficiência por turma.', stack: [['React', 'front'], ['Supabase', 'banco'], ['Edge Functions', 'regras']], caso: 'gabarito-em-1-segundo' },
  { id: 'fr', sigla: 'FR', nome: 'Frequência', sub: 'edupresenca-app', x: 90, y: 56, numero: '300', unidade: 'escolas na meta', texto: 'Faltas, alertas de evasão e visitas domiciliares.', stack: [['Zustand + Zod', 'estado'], ['Supabase', 'multi-tenant'], ['Recharts', 'dashboard']], caso: 'presenca-e-confianca' },
  { id: 'ce', sigla: 'CE', nome: 'Certificados', sub: 'cert-validator', x: 70, y: 88, numero: 'QR', unidade: 'validação pública', texto: 'Cadastro de certificados e página de validação por QR Code.', stack: [['Firebase Auth', 'acesso'], ['Node API', 'back-end'], ['pdf-lib + qrcode', 'geração']], caso: 'presenca-e-confianca' },
  { id: 'gs', sigla: 'GS', nome: 'Gestão', sub: 'EduMetric · PDDE', x: 24, y: 84, numero: '2', unidade: 'produtos', texto: 'Desempenho escolar multi-tenant e prestação de contas do PDDE.', stack: [['React + TS', 'front'], ['shadcn/ui', 'interface'], ['Supabase', 'dados']], caso: 'gestao-escolar-como-saas' },
  { id: 'im', sigla: 'IM', nome: 'Importação', sub: 'csv-importador', x: 9, y: 52, numero: 'CSV', unidade: 'origem única', texto: 'Valida o CSV do cliente antes de qualquer gráfico.', stack: [['Papaparse', 'leitura'], ['Supabase', 'área temporária'], ['Power BI prep', 'legado']] },
];
