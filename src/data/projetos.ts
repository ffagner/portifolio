/**
 * Repositórios da espiral de projetos.
 * `caso` aponta para o slug da página de case quando existe.
 * Descrições dos projetos sem case foram escritas a partir do nome do repositório
 * e precisam de revisão (F0).
 */
export type Categoria = 'Dados' | 'Produto' | 'Automação';

export interface Projeto {
  nome: string;
  categoria: Categoria;
  publico: boolean;
  caso?: string;
  descricao: string;
}

export const projetos: Projeto[] = [
  { nome: 'painel-resultados-tendencia', categoria: 'Dados', publico: false, caso: 'resultados-sem-vazamento', descricao: 'Resultados de avaliações diagnósticas com LGPD por padrão.' },
  { nome: 'answer-sheets', categoria: 'Produto', publico: false, caso: 'gabarito-em-1-segundo', descricao: 'Correção de gabaritos e proficiência por turma.' },
  { nome: 'EduMetric-SaaS', categoria: 'Produto', publico: false, caso: 'gestao-escolar-como-saas', descricao: 'Protótipo de monitoramento de desempenho escolar multi-tenant.' },
  { nome: 'saas-pdde-app', categoria: 'Produto', publico: false, caso: 'gestao-escolar-como-saas', descricao: 'Gestão e prestação de contas do PDDE.' },
  { nome: 'edupresenca-app', categoria: 'Produto', publico: false, caso: 'presenca-e-confianca', descricao: 'Frequência escolar e alerta precoce de evasão.' },
  { nome: 'cert-validator', categoria: 'Produto', publico: true, caso: 'presenca-e-confianca', descricao: 'Emissão e validação de certificados por QR Code.' },
  { nome: 'csv-csv-importador', categoria: 'Dados', publico: false, descricao: 'Importador que valida o CSV do cliente antes de gravar no banco.' },
  { nome: 'powerbi-csv-prep', categoria: 'Dados', publico: false, descricao: 'Preparação de CSV para relatórios Power BI.' },
  { nome: 'school-compass', categoria: 'Produto', publico: false, descricao: 'Descrição a definir.' },
  { nome: 'reportlink-municipal-manager', categoria: 'Produto', publico: true, descricao: 'Gestão de links de relatórios por município.' },
  { nome: 'certificados-fl', categoria: 'Automação', publico: false, descricao: 'Geração de certificados.' },
  { nome: 'frequencia-back-end', categoria: 'Dados', publico: true, descricao: 'API de frequência escolar.' },
  { nome: 'gabarito-facil-escolas', categoria: 'Produto', publico: false, descricao: 'Gabaritos para escolas.' },
  { nome: 'bot-telegram', categoria: 'Automação', publico: false, descricao: 'Bot para Telegram.' },
  { nome: 'nest-base', categoria: 'Dados', publico: true, descricao: 'Base NestJS para novos back-ends.' },
  { nome: 'avaliacoe-CNCA', categoria: 'Dados', publico: true, descricao: 'Avaliações do Compromisso Nacional Criança Alfabetizada.' },
];
