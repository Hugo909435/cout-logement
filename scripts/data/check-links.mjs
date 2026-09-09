import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name === 'index.html') out.push(p);
  }
  return out;
}

const files = walk('dist');
const validPaths = new Set(
  files.map((f) => {
    const rel = path.relative('dist', path.dirname(f)).split(path.sep).join('/');
    return rel === '' ? '/' : `/${rel}/`;
  })
);

let checked = 0;
const broken = new Set();
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const hrefs = [...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.includes('.')) continue; // assets/rss/robots
    checked++;
    if (!validPaths.has(href)) broken.add(`${href}  (in ${f})`);
  }
}
console.log('checked', checked, 'internal links,', broken.size, 'broken');
console.log([...broken].slice(0, 30));
