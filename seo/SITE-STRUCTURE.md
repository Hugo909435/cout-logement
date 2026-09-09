# Architecture du site — coutlogement.fr

Statut : site non lancé. Accueil, méthodologie, sources, auteur, mentions légales sont en ligne. Les routes des silos (`/[silo]/`) et des articles (`/[silo]/[slug]/`) sont câblées mais vides. Les routes communales (`/commune/[communeSlug]/`) sont un stub (`getStaticPaths` renvoie `[]`).

## 1. Architecture actuelle (telle que construite)

```
/
├── /fiscalite-locale/                      hub de silo
├── /energie-logement/                      hub de silo
├── /aides-renovation/                      hub de silo
├── /[silo]/[slug]/                         article pilier OU satellite (même route, deux collections)
├── /commune/[communeSlug]/                 STUB — 0 page générée aujourd'hui
├── /methodologie/
├── /sources/
├── /auteur/
├── /mentions-legales/
└── /rss.xml
```

Modèle de contenu (`src/content.config.ts`) : deux collections, `piliers` (pages piliers, une par sujet de silo) et `blog` (articles satellites), chacune portant `silo`, `author`, `publishDate`/`updatedDate`, `heroImage`, `tags`. Chaque entrée `blog` doit déclarer un slug `pilier` existant dans `piliers/` — imposé par `scripts/validate-content.mjs`, qui fait échouer le build en cas de satellite orphelin. C'est un vrai atout structurel : il fait du maillage thématique en hub-and-spoke une invariance au moment du build, pas un vœu éditorial.

## 2. Écart : la couche communale n'a pas de palier intermédiaire

35 000 pages communales sans palier intermédiaire, ce n'est pas un sitemap, c'est un tas plat. Deux problèmes qui s'aggravent à cette échelle :

1. **Aucun chemin de crawl.** Rien ne renvoie en interne vers la plupart des pages communales, à part une entrée dans le sitemap. Les pages accessibles uniquement via le sitemap sont crawlées et indexées plus lentement et de façon moins régulière que les pages accessibles via des liens internes.
2. **Aucune valeur unique différenciée au niveau agrégé.** Le volume de recherche pour « taxe foncière à [ville] » se concentre au niveau communal pour les villes nommées, mais une grande partie de l'intention de recherche sur la fiscalité locale et le coût du logement est régionale/départementale (« taxe foncière la plus élevée dans le [département] », « comparer les communes du [département] »). Rien dans la structure actuelle ne répond à cette intention, et rien ne donne à la couche communale un parent de navigation naturel.

### Ajout recommandé : un palier de hub `/departement/[deptSlug]/`

```
/
├── /departement/                            index d'environ 101 départements
│   └── /departement/[deptSlug]/             hub : agrégats départementaux + liste des communes
│       └── renvoie vers → /commune/[communeSlug]/  (toutes les communes du département)
├── /commune/[communeSlug]/
│   ├── renvoie vers → /departement/[deptSlug]/   (parent dans le fil d'Ariane)
│   ├── renvoie vers → /[silo]/[pilier-slug]/     (contextuel : « comprendre ce chiffre »)
│   └── renvoie vers → 3-5 communes voisines/comparables (même département, tranche de taux similaire)
```

Pourquoi le département et non la région : la France métropolitaine compte 13 régions contre environ 101 départements (96 métropolitains + 5 DOM). Les départements correspondent à la façon dont les données fiscales locales françaises sont réellement publiées et recherchées (la DGFiP publie le REI par département ; « impôts locaux [département] » et « taxe foncière [département] » sont des schémas de requête établis) et offrent un hub plus resserré et réellement différencié — une page région agrégeant 8 à 10 départements risquerait elle-même d'être pauvre. Ne pas créer de palier région du tout ; il ajouterait une couche sans ajouter de demande de recherche ni de valeur de crawl.

Chaque page hub de département doit porter un vrai contenu agrégé, pas seulement une liste de liens, sous peine de devenir exactement le problème de page pauvre qu'elle est censée résoudre :
- Taux moyen/médian de taxe foncière sur les communes du département, sourcé depuis le même fichier REI de la DGFiP déjà utilisé
- Classement (taux les plus élevés/les plus bas) — un contenu intrinsèquement propice au lien et au partage
- Prix médian de transaction issu des DVF pour le département, si la couverture le permet
- Courte mise en contexte éditoriale (2-3 paragraphes) — rédigée une fois par département, pas du remplissage de gabarit

### Porte qualité de la page communale (prérequis à la génération de toute page)

Vu l'objectif « les ~35 000 communes », la porte doit s'appliquer au niveau de la complétude des données, pas au niveau du palier de population — sinon soit les petites communes sont exclues (ce qui affaiblit le positionnement « couverture complète »), soit des pages pauvres sont publiées pour des hameaux où les jeux de données sous-jacents n'ont rien à dire.

Seuil minimal pour générer une page communale :
- Une fiche REI de la DGFiP existe pour la commune (taux + produit voté) — quasi universel, donc c'est le plancher
- Une entrée de référence INSEE (population, code officiel géographique) — également quasi universelle

Sections conditionnelles dans une page (affichées uniquement si la donnée existe, jamais un bloc « donnée indisponible » qui se lirait comme du contenu pauvre) :
- Section DVF : uniquement si la commune a un nombre minimal de transactions sur la fenêtre DVF en cours (recommandation : ≥5 transactions sur les 24 derniers mois ; en dessous, la donnée de prix au niveau transaction est à la fois statistiquement peu fiable et pose un risque de ré-identification/vie privée dans les très petites communes — omettre la section plutôt que d'afficher 1 ou 2 points de données)
- Section DPE : uniquement si l'ADEME a des diagnostics enregistrés pour la commune

Cela signifie que la *profondeur* de page varie selon la commune (une petite commune rurale a une page plus courte mais toujours substantielle ; une ville a la page complète), mais que chaque page publiée franchit un vrai plancher de données. C'est la décision technique/éditoriale la plus déterminante pour éviter un problème de contenu pauvre façon Panda à l'échelle de 35 000 pages — voir `SEO-STRATEGY.md` pour la façon dont cela s'articule avec le déploiement par phases.

## 3. Règles de maillage interne

| Depuis | Doit renvoyer vers |
|---|---|
| Page commune | Hub département parent ; 1-2 pages piliers pertinentes contextuellement (ex. commune à taux élevé → pilier « Comprendre la taxe foncière ») ; 3-5 communes comparables (même département, tranche de taux voisine) |
| Hub département | Toutes les communes du département (paginé/filtrable, pas une seule page à 2 000 liens) ; index parent `/departement/` ; silos pertinents |
| Page pilier | Son hub de silo ; 2-3 articles satellites qui en dépendent (déjà imposé par le modèle de contenu) ; 1-2 pages communales en exemple illustrant la notion (ex. « Comprendre le DPE » → lien vers une page communale avec une section DPE riche) |
| Hub de silo | Tous les piliers et satellites du silo (déjà implémenté) ; les deux autres hubs de silo |
| Satellite de blog | Son pilier parent (imposé structurellement) ; son hub de silo |

Cela referme la boucle actuellement manquante : les pages communales et le contenu pilier/blog n'ont aujourd'hui aucun chemin prévu l'un vers l'autre. Sans cela, la couche communale représente 35 000 pages indexées côté SEO qui n'apportent aucune autorité au contenu éditorial, et réciproquement.

## 4. Notes d'URL et techniques

- Garder `/commune/[communeSlug]/` plat (pas `/departement/[deptSlug]/commune/[slug]/`) — des URL communales plates sont plus courtes, stables indépendamment des changements de limites départementales, et correspondent à la façon dont les gens recherchent (« taxe foncière [nom de commune] », pas « taxe foncière [département]/[commune] »). La relation au département s'exprime via le maillage interne et le fil d'Ariane/schema, pas via le chemin d'URL.
- `@astrojs/sitemap` découpe automatiquement à 45 000 URL par fichier sitemap et génère un sitemap index — aucun découpage manuel nécessaire même à pleine échelle des 35 000 communes, mais à confirmer une fois la génération communale en production (vérifier la structure de `dist/sitemap-index.xml` en CI).
- Aucun `robots.txt` actuellement dans `public/` — à ajouter avant la mise en ligne des pages communales à grande échelle, principalement pour orienter l'allocation du budget de crawl (ex. dépriorisation de tout paramètre d'URL à faible valeur) plutôt que pour bloquer quoi que ce soit.
- Ajouter le schema `BreadcrumbList` sur les pages communales et départementales une fois le palier hub en place (commune → département → accueil) — peu coûteux étant donné que `SEO.astro` centralise déjà l'injection JSON-LD, et renforce directement la structure hub-and-spoke auprès des robots.
