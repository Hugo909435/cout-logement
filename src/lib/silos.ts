import type { Silo } from '../content.config';

export const SILO_META: Record<Silo, { label: string; description: string }> = {
  'fiscalite-locale': {
    label: 'Fiscalité locale',
    description: 'Taxe foncière, taxe d’habitation, impôts locaux liés au logement.',
  },
  'energie-logement': {
    label: 'Énergie du logement',
    description: 'Chauffage, électricité, DPE et coût énergétique du logement.',
  },
  'aides-renovation': {
    label: 'Aides à la rénovation',
    description: 'MaPrimeRénov’, éco-PTZ et dispositifs de financement des travaux.',
  },
};

export const SILO_ORDER: Silo[] = ['fiscalite-locale', 'energie-logement', 'aides-renovation'];
