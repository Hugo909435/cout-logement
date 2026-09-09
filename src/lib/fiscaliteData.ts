import departementsData from '../data/geo/departements.json';
import communesData from '../data/geo/communes.json';
import reiData from '../data/fiscalite/rei-tfpb.json';

export interface Departement {
  code: string;
  nom: string;
  slug: string;
}

export interface CommuneGeo {
  code: string;
  nom: string;
  slug: string;
  codeDepartement: string;
  population: number | null;
  codesPostaux: string[];
}

export interface CommuneFiscalite {
  tfpbTauxNet: number;
  tfpbTauxVote: number | null;
  tfpbBaseNette: number | null;
  tfpbProduitReel: number | null;
  tfpbNbArticles: number | null;
}

export type CommuneComplete = CommuneGeo & { fiscalite: CommuneFiscalite };

/**
 * Départements dont les pages communales sont déjà publiées (phase 1 —
 * déploiement pilote, voir seo/IMPLEMENTATION-ROADMAP.md). Un mélange
 * volontaire dense/rural : 94 (Val-de-Marne, 47 communes, petite couronne
 * parisienne) et 90 (Territoire de Belfort, 101 communes, profil plus rural).
 * Lever cette restriction déclenche la génération nationale (phase 2).
 */
export const PILOT_DEPARTEMENT_CODES: readonly string[] = ['94', '90'];

const REI = reiData as {
  millesime: string;
  source: string;
  communes: Record<string, CommuneFiscalite & { libcom: string }>;
};

export const REI_MILLESIME = REI.millesime;
export const REI_SOURCE = REI.source;

const departementsBySlug = new Map<string, Departement>(
  (departementsData as Departement[]).map((d) => [d.slug, d])
);

/**
 * Porte de complétude des données (voir seo/SITE-STRUCTURE.md §2) : une
 * commune n'est éligible à une page que si elle a une entrée REI exploitable
 * (taux TFPB net non occulté par le secret statistique). Le référentiel
 * géographique INSEE seul ne suffit pas.
 */
function isDataComplete(code: string): boolean {
  return REI.communes[code] !== undefined;
}

function toCommuneComplete(c: CommuneGeo): CommuneComplete | null {
  const rei = REI.communes[c.code];
  if (!rei) return null;
  const { libcom: _libcom, ...fiscalite } = rei;
  return { ...c, fiscalite };
}

export function getAllDepartements(): Departement[] {
  return [...(departementsData as Departement[])].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export function getDepartementBySlug(slug: string): Departement | undefined {
  return departementsBySlug.get(slug);
}

/** Toutes les communes d'un département disposant de données fiscales exploitables, triées par taux TFPB décroissant. */
export function getCommunesFiscalesForDepartement(codeDepartement: string): CommuneComplete[] {
  return (communesData as CommuneGeo[])
    .filter((c) => c.codeDepartement === codeDepartement && isDataComplete(c.code))
    .map(toCommuneComplete)
    .filter((c): c is CommuneComplete => c !== null)
    .sort((a, b) => b.fiscalite.tfpbTauxNet - a.fiscalite.tfpbTauxNet);
}

export interface DepartementAggregats {
  nbCommunesReferencees: number;
  nbCommunesDonneesCompletes: number;
  tauxMoyen: number;
  tauxMedian: number;
  tauxMin: { commune: CommuneComplete } | null;
  tauxMax: { commune: CommuneComplete } | null;
  produitTotal: number;
}

/** Agrégats calculés depuis les données REI réelles — pas de valeur inventée. */
export function getDepartementAggregats(codeDepartement: string): DepartementAggregats {
  const nbCommunesReferencees = (communesData as CommuneGeo[]).filter(
    (c) => c.codeDepartement === codeDepartement
  ).length;
  const communes = getCommunesFiscalesForDepartement(codeDepartement);
  const taux = communes.map((c) => c.fiscalite.tfpbTauxNet).sort((a, b) => a - b);
  const n = taux.length;
  const tauxMoyen = n === 0 ? 0 : taux.reduce((sum, t) => sum + t, 0) / n;
  const tauxMedian = n === 0 ? 0 : n % 2 === 1 ? taux[(n - 1) / 2] : (taux[n / 2 - 1] + taux[n / 2]) / 2;
  const produitTotal = communes.reduce((sum, c) => sum + (c.fiscalite.tfpbProduitReel ?? 0), 0);

  return {
    nbCommunesReferencees,
    nbCommunesDonneesCompletes: n,
    tauxMoyen,
    tauxMedian,
    tauxMin: n === 0 ? null : { commune: communes[n - 1] },
    tauxMax: n === 0 ? null : { commune: communes[0] },
    produitTotal,
  };
}

/** Une commune est publiée si elle a des données complètes ET appartient à un département pilote (phase 1). */
export function isCommunePublished(c: CommuneGeo): boolean {
  return isDataComplete(c.code) && PILOT_DEPARTEMENT_CODES.includes(c.codeDepartement);
}

export function getPublishedCommunes(): CommuneComplete[] {
  return (communesData as CommuneGeo[])
    .filter(isCommunePublished)
    .map(toCommuneComplete)
    .filter((c): c is CommuneComplete => c !== null);
}

export function getCommuneBySlug(slug: string): CommuneComplete | null {
  const geo = (communesData as CommuneGeo[]).find((c) => c.slug === slug);
  if (!geo || !isCommunePublished(geo)) return null;
  return toCommuneComplete(geo);
}
