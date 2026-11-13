# Portfólio ffagner — Plano

Atualizado em 13/11/2026. Versão editável: [documento do plano](https://claude.ai/artifact/AsSKsxERuBpnvgxU4yzGFN).

## Visão e posicionamento

O portfólio apresenta ffagner como **Dev Full-Stack EdTech**: quem transforma dado educacional bruto em produto que gestor público usa. A tese do site é uma frase só: **"Software que faz a rede pública enxergar seus alunos."**

Os repositórios sustentam essa tese com fatos, não adjetivos:

- O Painel de Resultados substituiu relatórios Power BI públicos que expunham nomes de crianças e chegaram a ser indexados no Google (LGPD).
- O EduPresença detecta risco de evasão cedo e já nasce multi-tenant para escalar de 1 município (~20 escolas) para ~300 escolas e 30.000 alunos.
- Answer Sheets, Cert Validator e SaaS PDDE tiram processos manuais do papel: gabarito, certificado e prestação de contas.

**Público-alvo**, por ordem de prioridade:

1. Consultorias e secretarias de educação que contratam produto ou projeto.
2. Recrutadores e tech leads de EdTechs e GovTechs.
3. Comunidade dev (código aberto, artigos, credibilidade técnica).

**Conversão principal:** contato para projeto ou vaga. **Secundária:** visita ao GitHub e leitura de um case completo.

## Direção visual: Sinal

A direção segue as duas referências enviadas (Idea Revenue e Twin, no Dribbble): tech editorial escuro, partículas como linguagem e 3D usado em momentos-chave. No conceito **"Sinal"**, cada ponto na tela é um aluno, e os pontos se organizam em escolas, turmas e gráficos conforme a rolagem.

| Elemento | Decisão |
| --- | --- |
| Fundo | Oliva quase preto (`#0d0e0a`) com brilho radial verde no hero |
| Destaque | Verde-limão (`#cdf564`), só para dado ativo e chamada principal |
| Seções claras | Creme (`#f3f2ea`) nas seções de decisões e ecossistema |
| Títulos | Hanken Grotesk 400, segunda linha em tom apagado |
| Rótulos | JetBrains Mono 11px, maiúsculas, ponto colorido antes |
| Botões | Pílulas: limão sólido e vidro escuro |

**Momentos 3D:**

- **Loader** com contagem de "alunos carregados" enquanto os pontos aparecem.
- **Hero:** plano 3D de partículas (Three.js) que reage ao cursor, com cards de vidro presos por hastes.
- **Fluxo:** partículas convergindo num ponto — CSV bruto → validação → snapshot → painel, em 4 abas.
- **Ecossistema:** grafo de nós com inspetor lateral ("um modelo conectado").
- **Projetos:** espiral 3D com os repositórios; clique abre um modal de vidro com métricas.
- **Contato:** esfera de pontos e terminal interativo; rodapé com marca gigante e degradê verde.

**Vídeos:** cada card de case vai tocar uma gravação curta do produto real em loop (MP4/WebM mudo, 6–10 s, com dados fictícios), carregada só quando o card entra na tela.

**Limites:** com `prefers-reduced-motion` o 3D vira imagem estática. No celular, menos partículas e pausa fora da tela. Texto sempre com contraste AA. Meta: Lighthouse ≥ 90.

## Arquitetura de informação

Home de rolagem única e uma página por case.

| Ordem | Seção | Conteúdo |
| --- | --- | --- |
| 1 | Hero · Sinal | Campo de pontos 3D e a tese em uma frase |
| 2 | Como funciona | Fluxo de dados em 4 passos |
| 3 | Decisões | LGPD por padrão, arquivo em vez de consulta, multi-tenant |
| 4 | Ecossistema | Grafo dos produtos conectados |
| 5 | Cases | 4 cards com tilt 3D e modal |
| 6 | Projetos | Espiral 3D dos repositórios |
| 7 | Stack | Ferramentas por camada |
| 8 | Contato | Terminal e esfera de pontos |

## Cases

| Case | Repositório líder | Problema | Solução | Stack |
| --- | --- | --- | --- | --- |
| 01 · Resultados sem vazamento | painel-resultados-tendencia | Power BI público expunha dados nominais de crianças; um relatório por município, série e caderno | Snapshots JSON em bucket privado, um arquivo por escola, cálculo no navegador | React, Vite, Supabase, TanStack, Recharts, jsPDF |
| 02 · Gabarito em 1 segundo | answer-sheets | Correção manual de cadernos em papel e tabulação por turma | Portal do aluno, chaves-mestre de gabarito e relatório de proficiência automático | React, Vite, Supabase, Edge Functions |
| 03 · Gestão escolar como SaaS | EduMetric-SaaS + saas-pdde-app | Gestores sem visão consolidada; prestação de contas do PDDE em planilha | Plataforma multi-tenant com heatmap e mapa territorial; gestão financeira do PDDE | React, TypeScript, Recharts, Supabase, shadcn/ui |
| 04 · Presença e confiança | edupresenca-app + cert-validator | Evasão detectada tarde; certificados sem verificação | Alertas de risco de evasão e visitas domiciliares; QR Code com página pública de validação | React, Zustand, Zod, Supabase; Firebase, Node, pdf-lib |

**Cuidado obrigatório:** todos os prints e vídeos precisam usar dados fictícios.

## Stack do site

| Camada | Escolha |
| --- | --- |
| Framework | Astro 5 com ilhas React |
| 3D | Three.js (React Three Fiber) |
| Motion | GSAP ScrollTrigger e Lenis |
| Estilo | Tailwind 4 com tokens em CSS |
| Conteúdo | Coleções MDX (um arquivo por case) |
| Contato | Netlify Forms |
| Deploy | Netlify com preview por PR |

## Roadmap

1. **F0 · Conteúdo e permissões** — nome público, repositórios que podem ser linkados, números publicáveis, prints e vídeos com dados fictícios.
2. **F1 · Protótipo e design system** — `index.html` deste repositório. *Gate: aprovação do visual.*
3. **F2 · Base do site** — Astro + Tailwind, home sem 3D, SEO, formulário.
4. **F3 · Camada 3D e motion** — partículas, fluxo, espiral, loader, fallback estático. *Gate: Lighthouse ≥ 90 e contraste AA.*
5. **F4 · Cases e lançamento** — páginas MDX, 404, domínio próprio, divulgação.

### Pendências (F0)

- [ ] Nome público do site e domínio
- [ ] Citação da Tendência Consultoria pelo nome
- [ ] Repositórios privados que podem ter o código linkado
- [ ] Números reais publicáveis (municípios, escolas, avaliações)
- [ ] Links de LinkedIn, GitHub e e-mail de contato
