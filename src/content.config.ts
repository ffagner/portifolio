import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    titulo: z.string(),
    ordem: z.number().int(),
    repos: z.array(z.string()).min(1),
    resumo: z.string(),
    /** Frase curta para o card da home. */
    chamada: z.string(),
    stack: z.array(z.string()),
    /** Tela animada usada enquanto não há vídeo gravado do produto. */
    tela: z.enum(['barras', 'gabarito', 'heatmap', 'lista']),
    /** Gravação do produto com dados fictícios: caminho base em /public/videos, sem extensão
     *  (ex.: /videos/meu-case → meu-case.webm, meu-case.mp4 e meu-case.jpg). */
    video: z.string().regex(/^\/videos\/[a-z0-9-]+$/).optional(),
    fluxo: z.tuple([z.string(), z.string(), z.string()]),
    numeros: z.array(z.object({ valor: z.string(), rotulo: z.string() })).min(2).max(4),
    licao: z.string(),
    status: z.enum(['Em produção', 'Em piloto', 'Em desenvolvimento', 'Protótipo']),
    /** Papel de ffagner no projeto. Vazio até ser confirmado (F0). */
    papel: z.array(z.string()).optional(),
  }),
});

export const collections = { cases };
