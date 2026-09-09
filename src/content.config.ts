import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const SILOS = ['fiscalite-locale', 'energie-logement', 'aides-renovation'] as const;

export type Silo = (typeof SILOS)[number];

const baseSchema = z.object({
  title: z.string().max(70),
  description: z.string().min(120).max(165),
  silo: z.enum(SILOS),
  author: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  heroImage: z.string(),
  tags: z.array(z.string()),
  draft: z.boolean().default(false),
});

const piliers = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/piliers' }),
  schema: baseSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: baseSchema.extend({
    // Slug du pilier du silo. Obligatoire : rend impossible la publication
    // d'un satellite orphelin. Existence vérifiée par scripts/validate-content.mjs.
    pilier: z.string(),
  }),
});

export const collections = { piliers, blog };
