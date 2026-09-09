# Stratégie SEO — coutlogement.fr

## 1. Vue d'ensemble

coutlogement.fr est un site de data-journalisme, pas encore lancé, qui publie du contenu sourcé, daté et fondé uniquement sur des données officielles, réparti en trois silos thématiques liés au coût du logement : **fiscalité locale** (impôts locaux), **énergie du logement** (chauffage, électricité, DPE) et **aides à la rénovation** (MaPrimeRénov', éco-PTZ). Le site prévoit d'ajouter une couche programmatique d'environ 35 000 pages communales, alimentée par les données de la DGFiP, l'ADEME, l'INSEE, France Rénov', l'ANAH et la CRE.

- **Modèle économique :** publicité display / trafic (la monétisation dépend du volume et de l'indexation durable, pas de la conversion de leads)
- **Moyens :** projet financé, calendrier ambitieux sur 6 à 12 mois
- **Périmètre cible :** couverture nationale complète (~35 000 communes), conditionnée par la complétude des données plutôt que par un seuil de population
- **Opérateur :** développeur solo, explicitement non fiscaliste ni conseiller financier ou juridique certifié — l'autorité du site repose sur la rigueur du sourcing, pas sur des titres professionnels

Ce plan s'appuie sur des fondations déjà réelles dans le code : un modèle de contenu silo → pilier → satellite fonctionnel avec validation des orphelins au moment du build, un composant `SEO.astro` centralisé qui émet déjà du JSON-LD Article/FAQPage/WebSite, et des pages E-E-A-T sincères (méthodologie, sources, auteur) avec suivi du millésime par jeu de données. La couche programmatique communale est en place dans le code mais ne génère aujourd'hui aucune page.

## 2. Positionnement concurrentiel

Détail complet dans `COMPETITOR-ANALYSIS.md`. En résumé : aucun concurrent ne combine taux d'imposition local, données énergie/DPE et aides à la rénovation à l'échelle de la commune. immo-dvf.fr possède les prix de transaction, Selectra possède l'éditorial énergie/rénovation, journaldunet.com possède les classements fiscaux — et aucun d'entre eux ne fait de contenu sourcé, transversal et communal à la fois. Cet écart est le différenciateur structurel de coutlogement.fr. La rigueur E-E-A-T est inégale sur ce marché (seuls immo-dvf.fr et Selectra la maîtrisent) — la discipline déjà en place sur méthodologie/sources/auteur est un atout concurrentiel existant, pas à construire de zéro. Les sources officielles (france-renov.gouv.fr, DGFiP) captent par défaut l'intention transactionnelle/simulateur ; l'opportunité se trouve dans le contenu explicatif et comparatif qu'elles ne produisent pas.

## 3. Architecture

Détail complet dans `SITE-STRUCTURE.md`. Le point faible identifié : 35 000 pages communales sans palier intermédiaire forment un ensemble plat, sans chemin de crawl interne ni réponse à l'intention de recherche au niveau départemental. Le plan ajoute un palier `/departement/[deptSlug]/` (~101 pages) entre le contenu silo/pilier et les pages communales, chaque page portant un vrai contenu agrégé (taux moyen/médian, classement, prix médian DVF, mise en contexte éditoriale) — pas une simple liste de liens. Cela exploite aussi directement l'écart identifié chez journaldunet.com (classements sommaires ; une version sourcée et mise en contexte les dépasse en profondeur).

Les pages communales sont conditionnées à la complétude des données (fichier REI DGFiP + INSEE obligatoires ; sections DVF/DPE conditionnelles selon des seuils minimaux) plutôt qu'à un seuil de population, pour que « couverture nationale complète » ne signifie pas publier des pages coquilles vides pour des communes sans données sous-jacentes.

## 4. Stratégie de contenu

Détail complet dans `CONTENT-CALENDAR.md`. Neuf pages piliers (trois par silo) et environ 55 articles satellites sur les six premiers mois, séquencés pour que le contenu pilier existe avant que les pages communales n'y renvoient. Les pages de comparaison/classement (ex. « communes où la taxe foncière est la plus élevée ») sont priorisées dès que le palier départemental est en ligne — c'est le type de contenu le plus rentable face à l'écart identifié chez JDN. Le plan E-E-A-T prolonge l'existant : un journal des corrections et une page de politique éditoriale sont les deux ajouts concrets ; le reste relève de la discipline (dates réellement à jour, aucune persona d'auteur fictive) plutôt que de nouveaux types de contenu.

## 5. Fondations techniques

**Déjà en place :**
- `SEO.astro` centralise l'injection du canonical, des balises OG/Twitter et du JSON-LD (Article, FAQPage, WebSite)
- Intégration `@astrojs/sitemap` (découpage automatique à 45 000 URL — à vérifier sur un build de test à pleine échelle avant de s'y fier en production)
- Validation du contenu au build (`scripts/validate-content.mjs`) empêchant les satellites orphelins
- Sortie statique (`output: 'static'`), Tailwind v4 via le plugin Vite

**Écarts à combler avant/pendant la montée en charge :**
- Aucun `robots.txt` dans `public/` — à ajouter avant la montée en charge des pages communales, principalement pour orienter le budget de crawl
- Aucun schéma `BreadcrumbList` — à ajouter une fois le palier départemental en place (commune → département → accueil)
- Aucun schéma Dataset sur méthodologie/sources (ajout prévu en phase 4 — pertinent au vu de la nature réelle de ces pages)
- La base Core Web Vitals doit être mesurée avec un vrai emplacement publicitaire dans le gabarit dès la phase 1, le site étant monétisé par la publicité display et le CLS lié aux emplacements pub étant la régression la plus probable — mesurer sur un aperçu sans publicité fausserait la base
- La porte de complétude des données communales n'est pas encore implémentée — c'est le chantier technique le plus prioritaire, car c'est le mécanisme qui évite le risque de contenu pauvre à l'échelle de 35 000 pages

**Préparation recherche IA / GEO :** les pages communales et départementales doivent présenter les chiffres clés sous forme de tableaux plutôt que de prose, car ce type de requête factuelle et locale est précisément ce que les moteurs de réponse IA (Google AI Overviews, Perplexity, recherche ChatGPT) citent directement. Suivre la fréquence de citation IA comme indicateur à part entière, en complément du trafic organique, comme le recommande le modèle éditeur — les KPI fondés sur le seul trafic deviennent moins fiables à mesure que les AI Overviews réduisent le taux de clic.

## 6. Feuille de route

Détail complet dans `IMPLEMENTATION-ROADMAP.md`. Quatre phases sur 12 mois :

1. **Fondations (semaines 1-4) :** palier départemental, porte de complétude des données communales, lot pilote de communes (3 à 5 départements), premier pilier par silo, mise en place technique
2. **Expansion (semaines 5-12) :** déploiement complet des communes (par lots départementaux, vérifiés progressivement dans Search Console), piliers restants, première vague de satellites, audit du maillage interne
3. **Montée en puissance (semaines 13-24) :** cadence de publication soutenue, pages de comparaison/classement, outreach/RP, passe GEO, audit CWV à pleine échelle
4. **Autorité (mois 7-12) :** cycle de rafraîchissement annuel des données opérationnalisé, analyses originales inter-communes, extension du schéma, optimisation continue à partir d'un an de données

Le principal risque de séquencement : publier les pages communales en volume avant que le palier départemental et la porte qualité n'existent. La phase 1 est structurée précisément pour imposer cet ordre.

## 7. Objectifs KPI

Aucune base réelle (site non lancé). Les cibles sont indicatives, à calibrer sur les données réelles du pilote de phase 1 avant l'engagement complet de la montée en charge en phase 2.

| Indicateur | Base | 3 mois | 6 mois | 12 mois |
|---|---|---|---|---|
| Pages indexées | 0 | ~3 000-5 000 (départements pilotes + éditorial) | ~35 000+ (couverture communale et départementale complète) | Stable à pleine couverture, rafraîchi annuellement |
| Sessions organiques/mois | 0 | Quelques milliers (délai d'indexation attendu sur le pilote) | Montée en charge significative avec la couverture complète | Défini à partir des résultats réels des phases 2-3, non préengagé |
| Positionnements (page 1, termes communaux + fiscalité locale) | 0 | Premiers positionnements sur la longue traîne des départements pilotes | Couverture large de la longue traîne sur l'ensemble des communes | Compétitif sur les termes de comparaison/classement face à JDN, immo-dvf.fr |
| Autorité de domaine (qualitative) | Domaine neuf | Signal précoce uniquement | Approche du niveau des acteurs établis de petite taille (cf. paliers dans `COMPETITOR-ANALYSIS.md`) | Comparable au niveau oumieuxvivre.fr/immo-dvf.fr |
| Core Web Vitals | Non encore mesuré avec publicité | Conforme sur les pages pilotes, pub incluse | Conforme à pleine échelle | Conformité maintenue, suivi continu |
| Fréquence de citation IA | 0 | Pas encore suivi | Première base de suivi établie | Indicateur à part entière, tendance établie |

## 8. Critères de réussite

- Le jalon de sortie de la phase 1 (indexation propre des départements pilotes, maillage hub↔commune↔pilier vérifié) doit être atteint avant que le déploiement par lots de la phase 2 ne se poursuive — c'est le principal point de contrôle de réduction des risques de tout le plan.
- Chaque lot communal de la phase 2 est vérifié dans Search Console pour son taux d'indexation avant que le lot suivant ne soit publié ; un lot dont l'indexation est nettement plus lente que le pilote suspend la suite du déploiement en attendant un diagnostic.
- Dépendance de moyens : un projet financé est supposé pour les phases 1 à 3 ; la cadence de la phase 4 est volontairement laissée ouverte, à définir à partir des résultats de la phase 3 plutôt que préengagée, car 12 mois est un horizon trop lointain pour planifier sujet par sujet avec confiance.
- Risque principal (signalé dans `IMPLEMENTATION-ROADMAP.md`) : publier la couche des 35 000 communes avant que le palier départemental et la porte de complétude des données n'existent. Les deux sont programmés en priorité en phase 1 précisément pour éviter cela.
