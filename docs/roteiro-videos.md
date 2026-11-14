# Roteiro dos vídeos dos produtos

Cada card de case e cada página de case mostram uma gravação curta do produto real, em loop, sem som. Este roteiro diz o que gravar em cada um, com quais dados e em que formato.

## Regras para todos os vídeos

- **Dados 100% fictícios.** Nenhum nome, escola ou município real. Os produtos rodam localmente, apontados para um backend simulado; nenhuma requisição chega a banco de produção.
- **Duração:** 8 a 10 s, pensados para loop: o último quadro volta naturalmente para o primeiro.
- **Formato:** 1280 × 800 px, 30 fps, sem áudio. Dois arquivos por vídeo: `.webm` (VP9) e `.mp4` (H.264), cada um com até ~1,5 MB.
- **Pôster:** um `.jpg` do primeiro quadro, exibido enquanto o vídeo carrega e para quem usa movimento reduzido.
- **Movimento:** cursor visível e lento; uma ação por tomada. Nada de rolagem rápida: o vídeo roda pequeno no card.
- **Arquivos:** `public/videos/<slug-do-case>.{webm,mp4,jpg}`, ligados no frontmatter do `.mdx` com `video: /videos/<slug-do-case>.mp4`.

## Case 01 · Resultados sem vazamento

**Produto:** `painel-resultados-tendencia` · **arquivo:** `resultados-sem-vazamento`
**O que o vídeo precisa provar:** um painel único lê o snapshot e responde aos filtros na hora, sem nova requisição.

| Tempo | Tela | Ação |
| --- | --- | --- |
| 0–2 s | Visão geral (T2) de uma avaliação | Cartões de proficiência e distribuição por faixa já carregados |
| 2–5 s | Barra de contexto | Troca o componente de Língua Portuguesa para Matemática; os gráficos se redesenham |
| 5–8 s | Filtro de escola | Escolhe uma escola; os números mudam instantaneamente |
| 8–10 s | Volta ao estado inicial | Filtro volta para "Todas", fechando o loop |

**Dados fictícios:** município "Vale Verde", avaliação "Caderno 2 · 5º Ano", 4 escolas ("EMEF Ipê Amarelo", "EMEF Jatobá", "EMEF Buriti", "EMEF Aroeira"), 26 questões, ~180 alunos com nomes gerados. O snapshot segue o schema 2 (`manifest.json`, `rede.json`, `escolas/*.json`).

## Case 02 · Gabarito em 1 segundo

**Produto:** `answer-sheets` · **arquivo:** `gabarito-em-1-segundo`
**O que o vídeo precisa provar:** a resposta lançada vira relatório de proficiência por turma.

| Tempo | Tela | Ação |
| --- | --- | --- |
| 0–3 s | Lançamento de gabaritos (`/gabaritos`) | Seleção em cascata: série, avaliação, matéria, aluno |
| 3–6 s | Mesmo formulário | Marca algumas alternativas e envia |
| 6–10 s | Relatório preliminar (`/relatorio-preliminar`) | Percentual de acerto da turma e por questão |

**Dados fictícios:** cidade "Vale Verde", escola "EMEF Ipê Amarelo", turma 5º A com 24 alunos gerados, avaliação "Diagnóstica 2026" com 10 questões A–D (mais X para em branco).

## Case 03 · Gestão escolar como SaaS

**Produto:** `EduMetric-SaaS` · **arquivo:** `gestao-escolar-como-saas`
**O que o vídeo precisa provar:** a secretaria enxerga a rede e sabe por onde começar.

| Tempo | Tela | Ação |
| --- | --- | --- |
| 0–3 s | Visão geral do município | Indicadores, rosca de proficiência e lista de prioridades |
| 3–6 s | Mapa territorial | Escolas no mapa, coloridas por desempenho |
| 6–10 s | Visão da escola | Entra numa escola da lista de prioridades e vê o heatmap de habilidades |

**Dados:** o `services/mockData.ts` do EduMetric traz um recorte de CSV com nomes de alunos e escolas que parecem reais. **Ele não foi usado na gravação**: a cópia de gravação troca esse CSV por 100 linhas fictícias (5 escolas "EMEF Ipê Amarelo", "Jatobá", "Buriti", "Aroeira" e "Carnaúba"). Vale substituir o arquivo no próprio repositório também. O **SaaS PDDE ainda não tem telas** (só a estrutura do projeto), então fica de fora deste vídeo; o texto do case já diz isso.

## Case 04 · Presença e confiança

**Produtos:** `edupresenca-app` e `cert-validator` · **arquivo:** `presenca-e-confianca`
**O que o vídeo precisa provar:** a falta vira alerta antes da evasão, e o certificado se valida sozinho.

| Tempo | Tela | Ação |
| --- | --- | --- |
| 0–3 s | EduPresença · alertas (`/ae/alertas`, perfil Agente Educacional) | Lista de alertas semanais e mensais, com contador de faltas |
| 3–6 s | EduPresença · alerta aberto | Abre um alerta e mostra o histórico de faltas do aluno |
| 6–10 s | Cert Validator · `/validar/:uuid` | Página pública: certificado **válido**, com nome, curso e data |

**Dados fictícios:** município "Vale Verde", escola "EMEF Jatobá", alunos com nomes gerados; certificado de "Formação em Avaliação Diagnóstica" emitido por "Instituto Exemplo".

## O que foi produzido (14/11/2026)

| Case | Duração | Arquivos | Como os dados foram simulados |
| --- | --- | --- | --- |
| 01 · Resultados sem vazamento | 9,7 s | `public/videos/resultados-sem-vazamento.*` | Snapshot gerado pelo próprio `montarSnapshot` do painel com 198 alunos fictícios; Auth, perfil e Storage do Supabase respondidos pelo Playwright |
| 02 · Gabarito em 1 segundo | 8,9 s | `public/videos/gabarito-em-1-segundo.*` | PostgREST simulado em memória, inclusive a regra de RLS por escola (`is_school_member`) |
| 03 · Gestão escolar como SaaS | 10,6 s | `public/videos/gestao-escolar-como-saas.*` | CSV embutido trocado por dados fictícios numa cópia do projeto |
| 04 · Presença e confiança | 8,3 s | `public/videos/presenca-e-confianca.*` | EduPresença já roda com banco simulado (`NOMES_FICTICIOS`); no Cert Validator, a leitura do Firestore foi trocada por um certificado fictício numa cópia |

Nas cópias de gravação, dois textos do produto que citavam clientes reais foram trocados: "FL Assessoria Pedagógica" por "Instituto Exemplo" (Cert Validator) e "Croatá-CE" por "Vale Verde" (rodapé do Answer Sheets). Os repositórios dos produtos não foram alterados.

## Como os vídeos são produzidos

1. Cada produto roda localmente (`vite`) com as variáveis do backend apontadas para um endereço falso (`http://backend.simulado`), que sobrepõem qualquer `.env` do repositório.
2. O Playwright abre o produto, injeta uma sessão de login simulada e responde às chamadas do Supabase, do Firebase e da API com os dados fictícios acima. **Qualquer requisição que não seja local ou simulada é bloqueada**, o que garante que nada chega a um banco real.
3. O Playwright grava a tela seguindo as tomadas; o `ffmpeg` corta, ajusta o loop e exporta WebM, MP4 e o pôster.

Os scripts ficam em `scripts/videos/`. Para regravar um vídeo depois de mudar o produto, rode o script do case.
