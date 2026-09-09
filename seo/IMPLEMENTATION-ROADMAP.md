# Feuille de route de mise en œuvre — coutlogement.fr

Moyens : projet financé. Objectif : couverture communale nationale complète (~35 000 pages) dans l'horizon de 12 mois, conditionnée par la complétude des données (voir `SITE-STRUCTURE.md` §2), pas par un seuil de population.

## Phase 1 — Fondations (semaines 1-4)

**Objectif :** mettre en ligne le palier de hub départemental, un premier lot de pages communales conditionnées, et le premier pilier de chaque silo, sur une base technique saine.

**Statut (2026-09-09) :** cœur technique et données réelles en place, vérifiés en local (`npm run build`, `npm run check`, audit de liens internes). Rien n'est encore déployé sur coutlogement.fr — voir les points ouverts ci-dessous.

- [x] Ajouter la route index `/departement/` + `/departement/[deptSlug]/`, avec le cahier des charges de contenu agrégé défini dans `SITE-STRUCTURE.md` §2 (taux moyen/médian, classement, mise en contexte éditoriale) — **fait pour les 101 départements**, à partir de vraies données DGFiP/INSEE. Section DVF volontairement absente : ce jeu de données n'a pas encore été ingéré (voir points ouverts).
- [x] Implémenter la porte de complétude des données communales dans le pipeline (`src/lib/fiscaliteData.ts`, fonctions `isCommunePublished`/`isDataComplete`) — REI DGFiP obligatoire ; DVF/DPE pas encore intégrés donc pas encore des conditions actives de la porte
- [x] Générer le premier lot de communes — **2 départements pilotes livrés** (Val-de-Marne 94, dense/urbain ; Territoire de Belfort 90, profil plus rural), 148 pages communales, au lieu des 3-5 prévus initialement : le pipeline de données couvre déjà les 101 départements/34 873 communes, ajouter un 3e département pilote est trivial dès que souhaité, mais 2 profils contrastés suffisaient pour valider la porte qualité et le maillage
- [x] Ajouter le schema JSON-LD `BreadcrumbList` aux gabarits commune + département (`SEO.astro`, prop `breadcrumbs`)
- [x] Ajouter un `robots.txt` (`public/robots.txt`, référence le sitemap)
- [ ] Rédiger et publier 1 page pilier par silo (3 au total) — **1/3 fait** : « Comprendre la taxe foncière » (silo fiscalité locale), lié depuis les pages commune et département. Restent à écrire : un pilier pour énergie du logement, un pour aides à la rénovation.
- [ ] Mise en place GA4 + Search Console — **non fait, bloqué sur vos accès** : nécessite un compte Google Analytics/Search Console vous appartenant (identifiants, propriété à créer et vérifier). Je ne peux pas créer ça à votre place — dites-moi quand vous voulez qu'on le fasse ensemble.
- [ ] Confirmer le comportement de découpage du sitemap sur un test à 35 000 URL — **non testé à cette échelle** : à 259 pages, un seul `sitemap-0.xml` est généré (comportement attendu sous le seuil de 45 000 documenté par `@astrojs/sitemap`), mais le découpage réel à pleine échelle nationale reste à vérifier.

**Points ouverts avant de considérer la phase 1 terminée :**
- **Rien n'est déployé.** Tout ce qui précède est vérifié en local (build + vérification de types + audit de liens internes : 0 lien cassé sur 4 101 liens internes contrôlés). Aucune vérification d'indexation réelle n'est possible avant un déploiement sur coutlogement.fr — aucune configuration d'hébergement (Netlify/Vercel/autre) n'existe encore dans le projet.
- Le pipeline de données est réel et reproductible : `scripts/data/build-geo-fiscalite.mjs` (sources : geo.api.gouv.fr pour le référentiel INSEE, data.economie.gouv.fr pour le REI DGFiP millésime 2025 — mapping des colonnes vérifié contre `TRACE_REI_2025.xlsx`, le dictionnaire de variables officiel joint à l'export DGFiP). Un script d'audit de maillage réutilisable existe aussi : `scripts/data/check-links.mjs`.
- DVF (prix de transaction) et DPE (ADEME) ne sont pas encore ingérés — la porte de complétude ne conditionne donc aujourd'hui que sur le REI. Les intégrer reste à faire avant de considérer la porte qualité complète telle que conçue dans `SITE-STRUCTURE.md`.

**Critères de sortie (rappel) :** départements pilotes entièrement en ligne avec un maillage hub→commune→pilier fonctionnel dans les deux sens (vérifié en local) ; sitemap et Search Console confirment tous deux une indexation propre du lot pilote avant toute montée en charge supplémentaire (Search Console non vérifiable tant que le site n'est pas déployé).

## Phase 2 — Expansion (semaines 5-12)

**Objectif :** monter en charge la génération des communes, lancer les satellites de blog, établir la cadence de publication.

- [ ] Étendre la génération des pages communales à tous les départements (objectif complet ~35 000 pages, conditionné comme défini en phase 1) — par lots départementaux, pour que chaque lot soit vérifiable indépendamment dans Search Console plutôt que de livrer les 35 000 pages en un seul déploiement
- [ ] Publier les piliers restants (objectif : 2-3 par silo, soit 6-9 au total) et les premiers satellites de blog sous chacun (objectif : 2-3 satellites par pilier à ce stade)
- [ ] Vérifier que la porte anti-orphelin de `validate-content.mjs` est bien câblée en CI, pas seulement en script local
- [ ] Suivre le taux d'indexation Search Console sur chaque lot communal — un lot qui indexe nettement plus lentement que le pilote est le signal le plus précoce d'un problème de qualité ou de budget de crawl ; suspendre les lots suivants pour diagnostiquer avant de continuer
- [ ] Audit du maillage interne : échantillonner des pages communales sur tous les paliers départementaux, confirmer l'absence de pages orphelines (chaque page accessible en ≤3 clics depuis l'accueil)
- [ ] Ajouter le type de contenu comparaison/classement (ex. « communes où la taxe foncière est la plus élevée du [département] ») — maille naturellement de nombreuses pages communales entre elles et est intrinsèquement plus propice au lien/partage qu'une seule page communale

**Critères de sortie :** couverture communale complète en ligne et indexant à un rythme sain ; chaque silo compte plusieurs piliers avec leurs satellites ; aucun constat de page orpheline lors de l'audit de maillage.

## Phase 3 — Montée en puissance (semaines 13-24)

**Objectif :** approfondir le contenu éditorial, commencer à générer des liens entrants, s'étendre vers les surfaces GEO/recherche IA.

- [ ] Étendre la cadence de publication du blog vers un rythme soutenu (fréquence à fixer une fois que les données de trafic de la phase 2 montrent quelles combinaisons silo/sujet performent)
- [ ] Outreach/RP ciblant le data-journalisme et la presse patrimoniale : « nous avons construit le seul site avec des données de coût du logement sourcées, datées et par commune pour toute la France » est un angle réellement différenciant — voir `COMPETITOR-ANALYSIS.md` pour l'écart concret de ce positionnement face aux acteurs en place
- [ ] Passe GEO : s'assurer que les pages communales et départementales présentent des points de données propres et citables (tableaux, pas de paragraphes de prose, pour les chiffres clés), car ce sont exactement le type de requêtes factuelles/locales que les moteurs de réponse IA citent directement
- [ ] Audit Core Web Vitals à l'échelle complète du volume de pages (site monétisé par la publicité — le CLS lié aux emplacements pub est la régression la plus probable ; à vérifier une fois l'implémentation publicitaire en ligne, pas avant)
- [ ] Évaluer les premières données de trafic/revenu publicitaire par rapport aux objectifs KPI de `SEO-STRATEGY.md` ; ajuster en conséquence la cadence de contenu et la priorisation des départements pour la phase 4

**Critères de sortie :** rythme de publication établi ; premiers liens entrants/mentions presse ; CWV conformes à pleine échelle ; suffisamment de données de trafic pour prioriser l'investissement de la phase 4 selon ce qui fonctionne réellement plutôt que par hypothèse.

## Phase 4 — Autorité (mois 7-12)

**Objectif :** transformer le positionnement fondé sur la donnée en autorité durable.

- [ ] Cycle de rafraîchissement annuel des données opérationnalisé (REI DGFiP, DVF et tarifs CRE suivent tous un calendrier fixe ou semi-fixe selon `sources.ts` — intégrer le rafraîchissement dans un processus récurrent, pas un ajustement manuel ponctuel, car des données fiscales communales périmées sapent directement la revendication centrale de confiance du site)
- [ ] Contenu de fond : analyses originales exploitant le jeu de données agrégé (ex. évolution du taux d'une année sur l'autre entre départements) qu'aucun concurrent page par page ne peut reproduire sans le même pipeline de données
- [ ] Revoir et étendre la couverture schema (le schema Dataset sur les pages méthodologie/sources vaut la peine à ce stade — c'est une description légitime de ce que sont ces pages, et cela soutient directement la découvrabilité en tant que data-journalisme)
- [ ] Boucle d'optimisation continue sur les pages communales/départementales sous-performantes identifiées sur une année complète de données Search Console

**Critères de sortie :** voir les objectifs KPI dans `SEO-STRATEGY.md`.

## Risques de séquencement à surveiller

- **Publier 35 000 pages avant que le palier hub et la porte qualité n'existent** est le risque le plus important de toute cette feuille de route — cela inverse l'ordre de dépendance et expose à un problème de contenu pauvre à grande échelle, bien plus coûteux à corriger après indexation qu'à prévenir avant lancement. La phase 1 existe précisément pour imposer cet ordre.
- **Une implémentation publicitaire tardive et non testée face aux Core Web Vitals** — la monétisation étant fondée sur la publicité display, intégrer un vrai emplacement publicitaire dans le gabarit communal pilote dès la phase 1 (même si les publicités ne sont pas encore en ligne), pour que les chiffres CWV sur toute la feuille de route reflètent le poids réel de la page, pas un aperçu sans publicité qui ne correspondra pas à la production.
