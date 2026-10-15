# Contribuer aux dépôts Geonative

Ce guide s'applique à **tous les dépôts de l'organisation**. Un dépôt peut le compléter avec ses propres spécificités dans son `README.md`.

## Pull Requests

Toutes les règles sont dans **[docs/pull-request-rules.md](https://github.com/geonativefr/.github/blob/main/docs/pull-request-rules.md)**. En bref :

- **Titre** au format `<type>(<scope>): <description>`, à l'impératif, ~60 caractères, sans point-virgule.
- **Description en anglais**, qui commence directement par un résumé de 3 à 5 lignes, sans titre markdown.
- Puis, seulement si nécessaire et dans cet ordre : `**TODO Staging:**`, `**TODO Prod:**`, `**PRs Dependency:**`, `**Related PRs:**`.
- Une section TODO dès qu'il y a quelque chose à faire au déploiement : une case `- [ ]` par action, écrite en entier.
- Toute PR est **ouverte en Draft**, puis passée en « Ready for review » quand elle est prête.

Le modèle de description est pré-rempli à l'ouverture de chaque PR. Supprime les sections inutiles.

## Vérification automatique

Le check **PR rules / Title and description** vérifie le titre et la description de chaque PR. S'il échoue, le détail des règles non respectées s'affiche dans le résumé du job. Corrige le titre ou la description : le check se relance seul, sans nouveau commit.

## Commits

- Même convention que les titres de PR : `<type>(<scope>): <description>`, à l'impératif (`add`, pas `added`).
- Un corps de message seulement quand le pourquoi n'est pas évident à la lecture du diff.

## Faire évoluer ces règles

Ces règles vivent dans le dépôt [geonativefr/.github](https://github.com/geonativefr/.github). Toute évolution passe par une PR sur ce dépôt.
