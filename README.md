# Portfólio ffagner

Portfólio de Dev Full-Stack EdTech: **"Software que faz a rede pública enxergar seus alunos."**

Site estático em [Astro 5](https://astro.build), com Tailwind 4 e Three.js. Cada ponto na tela é um aluno.

## Rodar

Requer Node 22.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` roda o `astro check` (tipos) antes de gerar `dist/`.

## Estrutura

```
src/
  content/cases/      um .mdx por case (texto + frontmatter validado em content.config.ts)
  data/               site.ts (textos e links), projetos.ts (espiral), ecossistema.ts (grafo)
  components/         Hero, Fluxo, Principios, Ecossistema, Cases, Biblioteca, Stack, Contato, Tela…
  scripts/            comportamento: hero.ts (Three.js), fluxo.ts, ecossistema.ts, biblioteca.ts, contato.ts
  layouts/Base.astro  <head> com SEO e Open Graph, navegação e rodapé
  pages/              index, cases/[slug], 404
public/               favicon, og.png, robots.txt
docs/                 plano.md e o protótipo original (docs/prototipo/index.html)
```

### Para editar

- **Textos da home, números do hero, passos do fluxo e stack:** `src/data/site.ts`.
- **Um case:** o `.mdx` correspondente em `src/content/cases/`. O frontmatter define título, números, stack e a tela animada.
- **Vídeo do produto num case:** coloque o arquivo em `public/videos/` e adicione `video: /videos/nome.mp4` no frontmatter. A tela animada é substituída pelo vídeo.
- **Projetos da espiral:** `src/data/projetos.ts`.

## Deploy (Netlify)

`netlify.toml` já configura build, pasta `dist` e cabeçalhos de cache. Ao conectar o repositório no Netlify:

1. Defina a variável `SITE_URL` com o domínio final (usada no sitemap, canonical e Open Graph).
2. Ative **Forms** no painel do site: o formulário de contato usa Netlify Forms.

## Acessibilidade e desempenho

- Com `prefers-reduced-motion`, o 3D desenha um único quadro e as animações param.
- Sem WebGL, o hero mostra um plano de pontos estático em CSS.
- Three.js é baixado só quando o hero aparece; animações pausam fora da tela e com a aba em segundo plano.
- Fontes servidas pelo próprio site (Fontsource), sem chamadas externas.

## Pendências (F0)

- [ ] Domínio final e `SITE_URL`
- [x] E-mail e LinkedIn em `src/data/site.ts`
- [ ] Papel de ffagner em cada case (`papel:` no frontmatter; a seção só aparece quando preenchida)
- [ ] Revisar as descrições dos projetos sem case em `src/data/projetos.ts`, que foram escritas a partir do nome do repositório
- [ ] Gravar os vídeos dos produtos com dados fictícios
- [ ] Confirmar o status de cada case (Em produção, Em desenvolvimento, Protótipo)

A seção **Sobre** usa `src/data/sobre.ts` (trajetória, certificações e números, tirados do perfil do LinkedIn).

O plano completo está em [`docs/plano.md`](docs/plano.md).
