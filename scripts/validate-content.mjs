import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');
const ENTRY_PATTERN = /\.(md|mdx)$/;

function listEntries(dir) {
  return readdirSync(dir).filter((f) => ENTRY_PATTERN.test(f));
}

const pilierFiles = listEntries(join(CONTENT_DIR, 'piliers'));
const pilierSlugs = new Set(pilierFiles.map((f) => f.replace(ENTRY_PATTERN, '')));

const blogDir = join(CONTENT_DIR, 'blog');
const blogFiles = listEntries(blogDir);

const errors = [];

for (const file of blogFiles) {
  const raw = readFileSync(join(blogDir, file), 'utf8');
  const { data } = matter(raw);

  if (!data.pilier) {
    errors.push(`src/content/blog/${file} : champ "pilier" manquant.`);
    continue;
  }

  if (!pilierSlugs.has(data.pilier)) {
    errors.push(
      `src/content/blog/${file} : le pilier "${data.pilier}" n'existe pas dans src/content/piliers/ (satellite orphelin).`
    );
  }
}

if (errors.length > 0) {
  console.error('\nValidation du contenu échouée :\n');
  for (const error of errors) console.error(`  - ${error}`);
  console.error('');
  process.exit(1);
}

console.log(
  `Validation du contenu OK (${pilierSlugs.size} pilier(s), ${blogFiles.length} satellite(s)).`
);
