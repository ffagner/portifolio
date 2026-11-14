# Scripts de gravação dos vídeos

Gravam os produtos com **dados fictícios**, rodando localmente contra um backend simulado. Toda requisição que não seja `localhost` (ou CDN de estilo/fonte) é bloqueada pelo `gravador.cjs`, então nada chega a um banco real. O roteiro e as decisões estão em [`docs/roteiro-videos.md`](../../docs/roteiro-videos.md).

| Arquivo | Para quê |
| --- | --- |
| `gravador.cjs` | Grava com Playwright (cursor visível, rede bloqueada) e exporta WebM, MP4 e pôster com ffmpeg; `juntar()` une trechos com fade |
| `mock-painel.cjs` | Auth, `painel_perfis` e Storage do Supabase para o Painel de Resultados |
| `painel-gerar-snapshot.demo.test.ts` | Gera o snapshot fictício com o `montarSnapshot` do próprio painel (copie para `src/demo/` de uma cópia do painel e rode `SAIDA=… npx vitest run src/demo`) |
| `mock-answer.cjs` | PostgREST em memória para o Answer Sheets, com a regra de RLS por escola |
| `grava-*.cjs` | Uma sequência de tomadas por case |

## Passo a passo

1. Faça uma **cópia** de cada produto (sem `.git`, sem `.env`) e rode `vite` apontando para o backend falso, por exemplo:
   `VITE_SUPABASE_URL=http://backend.simulado VITE_SUPABASE_ANON_KEY=ficticia npx vite --port 5184`
   Portas usadas pelos scripts: EduMetric 5181, Cert Validator 5182, EduPresença 5183, Painel 5184, Answer Sheets 5185.
2. Rode o script do case passando a pasta de saída: `node grava-painel.cjs ./saida`.
3. Copie `saida/<slug>.{webm,mp4,jpg}` para `public/videos/`.

Requer Node 22, Playwright com Chromium e ffmpeg com `libvpx-vp9` e `libx264`.
