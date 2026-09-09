import { toString } from 'mdast-util-to-string';

/**
 * Détecte une section "## FAQ" dans le contenu, où chaque question est un H3
 * suivi d'un ou plusieurs paragraphes de réponse, et injecte le résultat dans
 * `data.astro.frontmatter.faq` pour que SEO.astro génère le JSON-LD FAQPage.
 */
export function remarkFaq() {
  return (tree, file) => {
    const faq = [];
    let inFaqSection = false;
    let current = null;

    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        if (current) faq.push(current);
        current = null;
        inFaqSection = toString(node).trim().toLowerCase() === 'faq';
        continue;
      }

      if (!inFaqSection) continue;

      if (node.type === 'heading' && node.depth === 3) {
        if (current) faq.push(current);
        current = { question: toString(node).trim(), answer: '' };
        continue;
      }

      if (current && node.type === 'paragraph') {
        const text = toString(node).trim();
        current.answer = current.answer ? `${current.answer} ${text}` : text;
      }
    }
    if (current) faq.push(current);

    if (faq.length > 0) {
      file.data.astro ??= {};
      file.data.astro.frontmatter ??= {};
      file.data.astro.frontmatter.faq = faq;
    }
  };
}
