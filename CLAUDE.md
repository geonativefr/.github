# geonativefr/.github

## Objectif

L'équipe de développement Geonative n'avait jamais formalisé ses bonnes pratiques. Ce dépôt est l'endroit où elle les met à plat : toutes ses bonnes pratiques, conventions et décisions, communes à tous les dépôts de l'organisation, celles en vigueur comme celles à venir. Tout développeur Geonative doit y trouver en quelques secondes la documentation dont il a besoin. La documentation s'enrichit à chaque décision, une page par sujet dans `docs/`.

Le dépôt porte aussi ce que GitHub applique à toute l'organisation :

- `CONTRIBUTING.md`, hérité par chaque dépôt qui n'a pas le sien. Aucun gabarit de PR n'est pré-rempli.
- `.github/workflows/pr-rules.yml`, workflow réutilisable qui vérifie le titre et la description des PR, appelé par les autres dépôts en `@main`.
- `workflow-templates/`, qui propose ce workflow dans l'onglet Actions des dépôts.

Tout ce qui arrive sur `main` s'applique aussitôt à la prochaine PR de chaque dépôt de l'organisation.

## Rédaction

- La documentation est en français. Le contenu des PR (titre, description, commentaires) est en anglais, y compris sur ce dépôt.
- La documentation s'adresse à tous les développeurs, pas seulement aux nouveaux : pas de ton d'accueil ni de parcours « première semaine ».
- Le README reste un index : la porte d'entrée vers la documentation, pas un document de règles.
- Chaque nouvelle page de `docs/` gagne une ligne dans le tableau « Documentation » du README, et ses questions fréquentes dans « Trouver une réponse rapidement ».
- Chaque document porte un statut dans ce tableau : « En vigueur » ou « À venir ». Une règle décidée mais pas encore appliquée s'écrit comme les autres, précédée dans sa page d'une ligne `> **À venir** : …` qui donne sa date dès qu'elle est fixée. Le jour où elle s'applique, la ligne disparaît et le statut passe « En vigueur ».
- `CONTRIBUTING.md` reste court : l'essentiel en une page, avec un lien vers le détail.
- Une règle vit à un seul endroit. Les autres fichiers la résument en une ligne et renvoient vers elle.
- Les liens de `CONTRIBUTING.md` sont absolus (`https://github.com/geonativefr/.github/blob/main/…`), car GitHub affiche ce fichier dans les autres dépôts. Ailleurs, les liens sont relatifs.
- Le dépôt est public : aucun nom d'hôte, adresse, secret ni détail interne. Les exemples utilisent des noms fictifs (`acme/api`, `staging-api-01`).

La procédure complète d'ajout d'une page est dans [docs/maintaining.md](docs/maintaining.md#ajouter-une-documentation).

## Règles vérifiées par le check

`docs/pull-request-rules.md` et le bloc `BEGIN rules … END rules` de `.github/workflows/pr-rules.yml` disent toujours la même chose. Une règle modifiée dans l'un l'est dans l'autre, avec un test dans `tests/pr-rules.test.mjs`. Les tests lisent le script directement dans le workflow, entre ses deux marqueurs.

```
node --test tests/*.test.mjs
```

Le check s'appelle `pr-rules / Title and description` : c'est ce nom qu'exige le ruleset d'organisation « PR rules ». Renommer le job `check` ou son `name`, ou le job `pr-rules` des workflows appelants, casse cette exigence dans tous les dépôts.

## Git

- Commits et titres de PR : Conventional Commits, `<type>(<scope>): <description>`, à l'impératif.
- Toute évolution passe par une PR ouverte en Draft. Le CI lance les tests et vérifie la PR avec la version du workflow qu'elle porte.
- Certains `.gitignore` globaux excluent `docs/`, `CONTRIBUTING.md` et `CLAUDE.md` : ajouter ces fichiers avec `git add -f` et vérifier `git ls-files` avant de pousser.
