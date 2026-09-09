import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Cout Logement',
    description:
      'Fiscalité locale, énergie du logement et aides à la rénovation : analyses et actualités.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/${post.data.silo}/${post.id}/`,
    })),
  });
}
