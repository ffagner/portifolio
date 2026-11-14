/** Seção "Sobre". Fonte: perfil do LinkedIn (exportado em 14/11/2026). */

export interface Marco {
  periodo: string;
  titulo: string;
  onde: string;
  tipo: 'trabalho' | 'formacao';
  atual?: boolean;
}

/** Em ordem cronológica: a história anda de cima para baixo. */
export const trajetoria: Marco[] = [
  { periodo: '2012 – hoje', titulo: 'Instrutor de informática', onde: 'Prefeitura Municipal de Croatá', tipo: 'trabalho', atual: true },
  { periodo: '2013 – 2017', titulo: 'Bacharelado em Ciências Contábeis', onde: 'Universidade Estadual Vale do Acaraú (UVA)', tipo: 'formacao' },
  { periodo: '2020 – 2021', titulo: 'MBA em Finanças', onde: 'Descomplica', tipo: 'formacao' },
  { periodo: '2021 – 2022', titulo: 'Tecnólogo em Desenvolvimento Back-end', onde: 'Anhanguera Educacional', tipo: 'formacao' },
  { periodo: '2023 – 2026', titulo: 'Tecnólogo em Análise e Desenvolvimento de Sistemas', onde: 'Estácio', tipo: 'formacao' },
  { periodo: '2025 – hoje', titulo: 'Coordenador de Estatística e Tecnologia', onde: 'Prefeitura Municipal de Croatá', tipo: 'trabalho', atual: true },
  { periodo: '2025 – 2026', titulo: 'Especialização em Educação Digital e Inovação Pedagógica na Educação Básica', onde: 'Universidade Federal de Mato Grosso do Sul (UFMS)', tipo: 'formacao' },
];

export const certificacoes = [
  'Formação APIs com Node.js e Express',
  'Formação Aprenda a programar em JavaScript com foco no back-end',
  'JavaScript: tipos, variáveis e funções',
  'Dashboard com Power BI: visualizando dados',
  'Blockchain Advanced',
];

export const numeros = [
  { valor: '14 anos', rotulo: 'na rede municipal de Croatá' },
  { valor: '2', rotulo: 'graduações em tecnologia' },
  { valor: '1', rotulo: 'especialização em educação digital' },
];
