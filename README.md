# Portfólio ffagner

Portfólio de Dev Full-Stack EdTech: **"Software que faz a rede pública enxergar seus alunos."**

Este repositório está na fase **F1 (protótipo)**. O `index.html` é um protótipo navegável, autocontido, que valida a direção visual antes do site definitivo em Astro.

## Ver o protótipo

Abra `index.html` no navegador, ou sirva a pasta:

```bash
npx serve .
```

Precisa de internet para carregar Three.js (cdnjs) e as fontes (Google Fonts).

## O que tem no protótipo

- Loader com contagem e marca em pontos
- Hero com plano 3D de partículas (Three.js) e cards de métricas presos por hastes
- Fluxo de dados em 4 passos (Importar → Validar → Snapshot → Painel)
- Decisões de arquitetura e grafo do ecossistema com inspetor
- 4 cases com tilt 3D e modal
- Espiral 3D de projetos com filtros
- Terminal de contato e esfera de pontos

Respeita `prefers-reduced-motion` e funciona em telas de celular.

## Plano

O plano completo (posicionamento, direção visual, cases, stack e roadmap) está em [`docs/plano.md`](docs/plano.md).
