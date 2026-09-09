// Pipeline de rafraîchissement des données géographiques et fiscales (REI).
//
// Sources (voir src/lib/sources.ts) :
// - INSEE / geo.api.gouv.fr : référentiel communes + départements (COG)
// - DGFiP : fichier REI (recensement des éléments d'imposition à la fiscalité
//   directe locale), export annuel sur data.economie.gouv.fr
//
// Usage : node scripts/data/build-geo-fiscalite.mjs <communes.json> <departements.json> <REI_YYYY.csv>
// Produit : src/data/geo/communes.json, src/data/geo/departements.json,
//           src/data/fiscalite/rei-tfpb.json
//
// Comment récupérer les fichiers d'entrée (aucun n'est versionné : le REI
// pèse ~110 Mo décompressé et se rafraîchit chaque année) :
//   - communes.json :
//       curl --ssl-no-revoke "https://geo.api.gouv.fr/communes?fields=nom,code,codeDepartement,codesPostaux,population" -o communes.json
//   - departements.json :
//       curl --ssl-no-revoke "https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion" -o departements.json
//   - REI_YYYY.csv : dataset "impots-locaux-fichier-de-recensement-des-elements-dimposition-a-la-fiscalite-dir"
//     sur data.economie.gouv.fr (DGFiP). Télécharger la pièce jointe
//     REI-YYYY-fichier-notice-trace.zip depuis la page du jeu de données sur
//     data.gouv.fr, puis extraire REI_YYYY.csv de l'archive.
//     (Sur Windows, curl peut nécessiter --ssl-no-revoke si la vérification
//     de révocation de certificat échoue derrière le réseau local.)
//
// Le fichier REI est un fichier communal agrégé (une ligne par commune).
// Colonnes utilisées (bloc E = FB = taxe foncière sur les propriétés bâties,
// confirmé via TRACE_REI_2025.xlsx, le dictionnaire de variables joint à
// l'export DGFiP) :
//   E11 = base nette communale · E12 = taux net (taux appliqué)
//   E12VOTE = taux voté · E13 = montant réel (produit) · E14 = nombre d'articles
// Un décalage entre E12 et E12VOTE peut exister sur les communes nouvelles en
// intégration fiscale progressive (voir notice DGFiP).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/'/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCsvLine(line) {
  // Le fichier REI n'a pas de champs entre guillemets contenant des ';' :
  // un split simple sur ';' est fiable ici (vérifié sur l'en-tête et un
  // échantillon de lignes).
  return line.split(';');
}

const [communesPath, departementsPath, reiCsvPath] = process.argv.slice(2);
if (!communesPath || !departementsPath || !reiCsvPath) {
  console.error('Usage: node build-geo-fiscalite.mjs <communes.json> <departements.json> <REI.csv>');
  process.exit(1);
}

// --- Départements ---
const departementsRaw = JSON.parse(readFileSync(departementsPath, 'utf8'));
const departements = departementsRaw
  .map((d) => ({ code: d.code, nom: d.nom, slug: slugify(d.nom) }))
  .sort((a, b) => a.code.localeCompare(b.code));

mkdirSync(new URL('../../src/data/geo/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../../src/data/geo/departements.json', import.meta.url),
  JSON.stringify(departements, null, 0)
);
console.log(`departements.json : ${departements.length} départements`);

// --- Communes (référentiel géographique) ---
const communesRaw = JSON.parse(readFileSync(communesPath, 'utf8'));
const communes = communesRaw.map((c) => ({
  code: c.code,
  nom: c.nom,
  slug: `${slugify(c.nom)}-${c.code.toLowerCase()}`,
  codeDepartement: c.codeDepartement,
  population: c.population ?? null,
  codesPostaux: c.codesPostaux ?? [],
}));
writeFileSync(
  new URL('../../src/data/geo/communes.json', import.meta.url),
  JSON.stringify(communes, null, 0)
);
console.log(`communes.json : ${communes.length} communes`);

// --- REI (fiscalité — taxe foncière sur les propriétés bâties) ---
const reiRaw = readFileSync(reiCsvPath, 'latin1');
const lines = reiRaw.split(/\r?\n/).filter((l) => l.length > 0);
const header = parseCsvLine(lines[0]);
const idx = Object.fromEntries(header.map((name, i) => [name, i]));

const required = ['DEP', 'COM', 'LIBCOM', 'E11', 'E12', 'E12VOTE', 'E13', 'E14'];
for (const col of required) {
  if (idx[col] === undefined) throw new Error(`Colonne REI manquante : ${col}`);
}

const rei = {};
let skipped = 0;
for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);
  if (row.length < header.length) {
    skipped++;
    continue;
  }
  const dep = row[idx.DEP];
  const com = row[idx.COM];
  // Code INSEE : concaténation DEP+COM, casse d'origine préservée (la Corse
  // utilise "2A"/"2B", pas "2a"/"2b" — voir src/data/geo/communes.json).
  const code = `${dep}${com}`;
  const tauxNet = row[idx.E12];
  const tauxVote = row[idx.E12VOTE];
  const produit = row[idx.E13];
  const base = row[idx.E11];
  // Secret statistique DGFiP : certaines valeurs sont occultées (champ vide)
  // pour les communes à très faible nombre d'articles d'imposition.
  if (tauxNet === '' || tauxNet === undefined) {
    skipped++;
    continue;
  }
  rei[code] = {
    libcom: row[idx.LIBCOM],
    tfpbBaseNette: base === '' ? null : Number(base),
    tfpbTauxNet: Number(tauxNet),
    tfpbTauxVote: tauxVote === '' ? null : Number(tauxVote),
    tfpbProduitReel: produit === '' ? null : Number(produit),
    tfpbNbArticles: row[idx.E14] === '' ? null : Number(row[idx.E14]),
  };
}

mkdirSync(new URL('../../src/data/fiscalite/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../../src/data/fiscalite/rei-tfpb.json', import.meta.url),
  JSON.stringify({ millesime: '2025', source: 'DGFiP — fichier REI 2025 (data.economie.gouv.fr)', communes: rei }, null, 0)
);
console.log(`rei-tfpb.json : ${Object.keys(rei).length} communes avec taux TFPB exploitable (${skipped} lignes occultées ou incomplètes)`);
