export interface SourceEntry {
  id: string;
  nom: string;
  organisme: string;
  fournit: string;
  millesime: string;
  frequence: string;
}

// Sources approuvées pour Cout Logement. Aucune autre source ne peut être
// citée dans un article sans être ajoutée ici d'abord.
export const SOURCES: SourceEntry[] = [
  {
    id: 'dgfip-rei',
    nom: 'DGFiP — fichier REI',
    organisme: 'Direction générale des Finances publiques',
    fournit:
      'Recensement des éléments d’imposition à la fiscalité directe locale : taux et produits votés par commune.',
    millesime: 'Exercice 2025',
    frequence: 'Annuelle',
  },
  {
    id: 'dgfip-dvf',
    nom: 'DGFiP — DVF',
    organisme: 'Direction générale des Finances publiques',
    fournit: 'Demandes de valeurs foncières : prix des transactions immobilières déclarées aux notaires.',
    millesime: 'Transactions jusqu’à avril 2026',
    frequence: 'Deux fois par an (avril, octobre)',
  },
  {
    id: 'ademe-dpe',
    nom: 'ADEME',
    organisme: 'Agence de la transition écologique',
    fournit: 'Base des diagnostics de performance énergétique (DPE) des logements existants.',
    millesime: 'Diagnostics déclarés depuis juillet 2021, jeu de données courant',
    frequence: 'Mensuelle',
  },
  {
    id: 'france-renov',
    nom: 'France Rénov’',
    organisme: 'Service public de la rénovation énergétique',
    fournit: 'Barèmes et conditions d’attribution de MaPrimeRénov’ et des aides associées.',
    millesime: 'Barème en vigueur depuis le 1er septembre 2026',
    frequence: 'Irrégulière, au gré des arrêtés',
  },
  {
    id: 'anah',
    nom: 'ANAH',
    organisme: 'Agence nationale de l’habitat',
    fournit: 'Conditions d’éligibilité, plafonds de ressources et instruction des dossiers MaPrimeRénov’.',
    millesime: 'Plafonds de ressources revalorisés au 1er janvier 2026',
    frequence: 'Annuelle',
  },
  {
    id: 'cre',
    nom: 'CRE',
    organisme: 'Commission de régulation de l’énergie',
    fournit:
      'Tarifs réglementés de vente de l’électricité et prix repère du gaz naturel.',
    millesime: 'Tarifs électricité au 1er août 2026',
    frequence: 'Électricité : deux fois par an · Gaz : mensuelle',
  },
  {
    id: 'insee',
    nom: 'INSEE',
    organisme: 'Institut national de la statistique et des études économiques',
    fournit: 'Code officiel géographique, population et référentiel des communes.',
    millesime: 'Millésime en vigueur au 1er janvier 2026',
    frequence: 'Annuelle',
  },
  {
    id: 'journal-officiel',
    nom: 'Journal officiel',
    organisme: 'Direction de l’information légale et administrative',
    fournit: 'Décrets et arrêtés qui fixent ou modifient les barèmes et taux cités sur ce site.',
    millesime: 'Textes en vigueur au 27 août 2026',
    frequence: 'Continue, au gré des publications',
  },
  {
    id: 'economie-gouv',
    nom: 'economie.gouv.fr',
    organisme: 'Ministère de l’Économie, des Finances et de la Souveraineté industrielle',
    fournit: 'Pages d’information officielles et simulateurs publics (impôts locaux, aides).',
    millesime: 'Consulté au 21 septembre 2026',
    frequence: 'Selon les pages',
  },
];
