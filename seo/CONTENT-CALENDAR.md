# Calendrier de contenu — coutlogement.fr

Cadence fondée sur des moyens de type projet financé (voir `IMPLEMENTATION-ROADMAP.md`). Tous les sujets ci-dessous sont informationnels/comparatifs, pas transactionnels/simulateur — un choix délibéré pour éviter d'entrer en concurrence directe avec `mesaides.france-renov.gouv.fr` et les outils propres de la DGFiP, conformément à `COMPETITOR-ANALYSIS.md`.

## Types de page et objectifs de volume (horizon 12 mois)

| Type de page | Objectif de volume | Source |
|---|---|---|
| Hubs de silo | 3 (fixe — déjà construits) | route existante |
| Pages piliers | 9 (3 par silo) | nouveau contenu |
| Satellites de blog | ~55 (voir cadence ci-dessous) | nouveau contenu, chacun rattaché à un pilier via `validate-content.mjs` |
| Hubs de département | ~101 | programmatique + mise en contexte éditoriale ponctuelle par page |
| Pages communales | ~35 000, conditionnées à la complétude des données | programmatique |
| Pages de comparaison/classement | 6-10 (national + top départements) | nouveau contenu, phases 2-3 |
| Pages utilitaires (méthodologie, sources, auteur, mentions légales) | 4 (déjà en ligne) | existant |

## Sujets piliers et satellites par silo

### Fiscalité locale
**Piliers :**
1. Comprendre la taxe foncière : calcul, taux, exonérations
2. Taxe d'habitation : qui la paie encore en 2026 et pourquoi
3. Comment sont fixés les taux d'imposition locale par les communes

**Satellites (5, une vague) :**
- Pourquoi ma taxe foncière a-t-elle augmenté en 2026 ?
- Taxe foncière et rénovation énergétique : quel impact sur mon imposition ?
- Communes où la taxe foncière a le plus augmenté depuis 2020
- Exonération de taxe foncière pour les personnes âgées : conditions 2026
- Comment contester sa taxe foncière : la procédure pas à pas

### Énergie du logement
**Piliers :**
1. Comprendre le DPE : ce que signifie chaque lettre pour votre logement
2. Le prix de l'électricité et du gaz en France : comment ça marche
3. Passoires thermiques : ce que la loi interdit désormais

**Satellites (5) :**
- DPE et prix de vente : quel impact réel sur la valeur d'un logement ?
- Tarif réglementé de l'électricité 2026 : ce qui change
- Chauffage au gaz vs pompe à chaleur : comparatif de coût réel
- Louer un logement classé G : ce que dit la loi en 2026
- Comment lire son DPE : guide pas à pas

### Aides à la rénovation
**Piliers :**
1. MaPrimeRénov' : barème, plafonds et conditions d'éligibilité 2026
2. L'éco-PTZ expliqué : montant, durée, travaux éligibles
3. Cumuler les aides à la rénovation : ce qui est possible en 2026

**Satellites (5) :**
- MaPrimeRénov' : combien pour une pompe à chaleur en 2026 ?
- Rénovation globale vs par geste : quelle aide choisir ?
- Les pièges à éviter avec les artisans RGE
- Aides à la rénovation : les changements du barème depuis septembre 2026
- Éco-PTZ et MaPrimeRénov' : peut-on les cumuler ?

### Pages de comparaison/classement (transversales, phases 2-3)
- Classement 2026 : les communes où la taxe foncière est la plus élevée en France
- Classement 2026 : les communes où la taxe foncière est la plus basse en France
- Les 20 communes où l'électricité pèse le plus dans le budget logement
- Où le DPE moyen des logements est-il le plus mauvais en France ?
- Une par top-10 départements (volume de recherche le plus élevé) une fois les hubs départementaux en ligne — au gabarit commun, mais avec des données classées uniques, pas de la prose dupliquée

Ces pages ciblent directement l'écart identifié face à journaldunet.com dans `COMPETITOR-ANALYSIS.md` : même format de classement, mais sourcé, daté et mis en contexte éditorialement plutôt qu'un simple tableau brut.

## Cadence de publication par phase

| Phase | Semaines | Piliers | Satellites | Autres |
|---|---|---|---|---|
| 1 — Fondations | 1-4 | 3 (un par silo) | 0 | Lot pilote de communes (3-5 départements) |
| 2 — Expansion | 5-12 | 6 (deux de plus par silo, total 9) | 15 (toute la vague silo 1 + début des vagues silo 2/3) | Début du déploiement complet des communes |
| 3 — Montée en puissance | 13-24 | 0 (réserve de sujets épuisée pour l'instant) | ~24 (≈2/semaine) + 6-10 pages de comparaison | Premiers liens entrants/mentions presse |
| 4 — Autorité | mois 7-12 | Révision/extension selon les résultats de la phase 3 | Rythme soutenu ~2/semaine + articles de fond (trimestriels) | Cycle de rafraîchissement annuel des données opérationnalisé |

Total de satellites de blog à la fin de la phase 3 : ~55, cohérent avec l'objectif de volume ci-dessus. La cadence et le choix des sujets de la phase 4 doivent être définis à partir des données de trafic de la phase 3, pas préengagés — ce calendrier ne fige volontairement pas les sujets au-delà du sixième mois.

## Plan de construction E-E-A-T

Le site dispose déjà de fondations réelles que la plupart des concurrents n'ont pas (voir `COMPETITOR-ANALYSIS.md`) : une page auteur nommée et sincère avec un disclaimer explicite sur ce que le site ne fait pas, une page méthodologie avec millésime par jeu de données, et une page sources qui conditionne ce qui peut être cité. Le plan consiste à prolonger cette discipline à mesure que le contenu monte en volume, pas à inventer de nouveaux signaux de confiance :

- **Journal des corrections** (absent aujourd'hui) : ajouter une page `/corrections/` listant les corrections factuelles avec leur date. Le modèle éditeur signale ceci comme un signal de confiance éditoriale standard, peu coûteux vu le positionnement déjà en place « chaque chiffre est traçable » — une extension naturelle, pas un nouveau chantier.
- **Page de politique éditoriale** (absente aujourd'hui) : une courte page énonçant les standards de sourcing (uniquement les organismes listés dans `sources.ts`, aucune donnée soumise par les utilisateurs, aucun placement sponsorisé influençant les classements) — pertinent vu la monétisation publicitaire, pour prévenir toute apparence de classement payant.
- **Garder chaque `updatedDate` réellement à jour.** La revendication centrale de différenciation du site est une donnée datée et sourcée — une date « mis à jour le » périmée sur une page méthodologie ou sources sape directement cette revendication. À rattacher au cycle de rafraîchissement annuel des données de la phase 4 de `IMPLEMENTATION-ROADMAP.md`.
- **Aucune persona d'auteur fictive.** Site mono-auteur — ne pas ajouter de signatures ou de titres inventés à mesure que le contenu monte en volume. Si des contributeurs sont ajoutés plus tard, appliquer le même standard que la page auteur actuelle (nom réel, rôle réel, déclaration explicite de ce qu'ils maîtrisent et de ce qu'ils ne maîtrisent pas).
- **Schema Dataset** sur les pages méthodologie/sources (phase 4, selon `IMPLEMENTATION-ROADMAP.md`) — une description exacte, pas aspirationnelle, de ce que sont réellement ces pages.

## Priorités

1. Les pages piliers avant la mise en ligne massive des pages communales — les pages communales renvoient vers les piliers pour le contexte (`SITE-STRUCTURE.md` §3) ; publier la cible du lien après que les liens existent, c'est faire les choses à l'envers.
2. Les pages de comparaison/classement sont plus rentables que des satellites supplémentaires une fois le palier départemental en place — elles sont intrinsèquement plus propices au lien et exploitent directement l'écart identifié chez JDN.
3. Le choix des sujets après la phase 3 doit suivre les données Search Console/GA4 sur le silo et le type de page qui convertissent réellement le trafic en revenu publicitaire, pas cette liste préétablie.
