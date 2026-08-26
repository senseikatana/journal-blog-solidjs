import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		readTime: z.number(),
		tags: z.array(z.string()).default([]),
		accent: z.string(),
		pattern: z.enum(['dots', 'lines', 'grid', 'circles', 'waves', 'triangles']),
	}),
});

export const collections = { blog };
