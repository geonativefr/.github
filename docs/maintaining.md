# Maintenir ce dépôt

Ce document s'adresse à qui fait évoluer les règles ou ajoute une documentation. Pour les règles elles-mêmes, voir le [README](../README.md).

## Contenu

```
.github/
├── README.md                          ← porte d'entrée : index de la documentation
├── CONTRIBUTING.md                    ← hérité par tous les dépôts
├── CLAUDE.md                          ← consignes pour Claude Code sur ce dépôt
├── pull_request_template.md           ← hérité par tous les dépôts
├── docs/
│   ├── pull-request-rules.md          ← règles détaillées des PR
│   └── maintaining.md                 ← ce fichier
├── .github/workflows/
│   ├── pr-rules.yml                   ← workflow réutilisable de vérification des PR
│   └── ci.yml                         ← tests et vérification de ce dépôt
├── workflow-templates/
│   ├── pr-rules.yml                   ← modèle proposé dans l'onglet Actions des dépôts
│   └── pr-rules.properties.json
└── tests/
    └── pr-rules.test.mjs              ← tests des règles du workflow
```

## Comment ça marche

**Héritage automatique.** GitHub utilise `CONTRIBUTING.md` et `pull_request_template.md` de ce dépôt pour chaque dépôt de l'organisation qui n'a pas sa propre version. Pour en profiter, un dépôt **ne doit pas** contenir son propre `pull_request_template.md` (ni à la racine, ni dans `.github/`, ni dans `docs/`) : supprime-le s'il existe.

Ce dépôt doit rester **public** pour que l'héritage fonctionne.

Ces deux fichiers s'affichent dans les autres dépôts : leurs liens sont toujours absolus (`https://github.com/geonativefr/.github/blob/main/…`).

**Vérification centralisée.** `.github/workflows/pr-rules.yml` contient toute la logique de vérification. Chaque dépôt l'appelle avec un fichier de quelques lignes qui ne change jamais. Une modification des règles ici s'applique à tous les dépôts dès leur prochaine PR.

## Activer la vérification sur un dépôt

Depuis le dépôt : onglet **Actions → New workflow → PR rules** (section « By Geonative »), puis commit.

Ou à la main, créer `.github/workflows/pr-rules.yml` :

```yaml
name: PR rules

on:
  pull_request:
    types: [opened, edited, reopened, synchronize, ready_for_review]

jobs:
  pr-rules:
    uses: geonativefr/.github/.github/workflows/pr-rules.yml@main
```

Pour un dépôt dont les commits ne suivent pas Conventional Commits :

```yaml
jobs:
  pr-rules:
    uses: geonativefr/.github/.github/workflows/pr-rules.yml@main
    with:
      conventional-commits: false
```

Pour rendre le check bloquant, l'ajouter en « required status check » dans une règle de protection de branche ou un ruleset d'organisation : `pr-rules / Title and description`.

## Ajouter une documentation

1. Créer la page dans `docs/`, en français, avec un nom de fichier en anglais et en kebab-case (`docs/code-review.md`).
2. L'ajouter au tableau « Documentation » du README avec son statut, « En vigueur » ou « À venir », et ses questions fréquentes au tableau « Trouver une réponse rapidement ».
   Une règle décidée mais pas encore appliquée est précédée dans sa page d'une ligne `> **À venir** : …`, avec sa date dès qu'elle est fixée. Le jour où elle s'applique, retirer cette ligne et passer le statut à « En vigueur ».
3. Si la règle fait partie de l'essentiel, la résumer en une ligne dans `CONTRIBUTING.md`, avec un lien absolu vers la page.
4. Ouvrir une PR sur ce dépôt.

Une règle vit à un seul endroit. Les autres fichiers la résument et renvoient vers elle.

Ce dépôt est public : aucun nom d'hôte, adresse, secret ni détail interne. Les exemples utilisent des noms fictifs (`acme/api`, `staging-api-01`).

## Faire évoluer les règles des PR

1. Modifier `docs/pull-request-rules.md` et, si la règle est vérifiable par un script, le bloc `BEGIN rules … END rules` de `.github/workflows/pr-rules.yml`.
2. Ajouter ou ajuster un test dans `tests/pr-rules.test.mjs`, puis lancer `node --test tests/*.test.mjs`.
3. Ouvrir une PR sur ce dépôt. Le CI lance les tests et vérifie la PR elle-même avec la nouvelle version du workflow.

Le document de règles et le script doivent toujours dire la même chose.
