# Bonnes pratiques de développement Geonative

L'équipe de développement met à plat ses bonnes pratiques. Ce dépôt les réunit toutes au même endroit : règles de contribution, conventions et décisions communes à **tous les dépôts de l'organisation**, celles en vigueur comme celles à venir.

## Documentation

| Document | Contenu | Statut |
|---|---|---|
| [Contribuer](CONTRIBUTING.md) | L'essentiel en une page : commits, Pull Requests, vérification automatique | En vigueur |
| [Règles des Pull Requests](docs/pull-request-rules.md) | Titre, description, TODO de déploiement, dépendances entre PR, labels Ready / Not Ready, captures d'écran, mises à jour de sécurité, checklist | En vigueur, vérification automatique à venir |

**En vigueur** : la règle s'applique dès maintenant. **À venir** : la règle est décidée et s'appliquera bientôt, sa date est indiquée dès qu'elle est fixée.

## Trouver une réponse rapidement

| Tu veux… | Lis |
|---|---|
| écrire un message de commit | [Commits](CONTRIBUTING.md#commits) |
| titrer une Pull Request | [Titre](docs/pull-request-rules.md#1-titre) |
| rédiger la description d'une Pull Request | [Description](docs/pull-request-rules.md#2-description) |
| noter ce qu'il faut faire au déploiement | [TODO Staging / TODO Prod](docs/pull-request-rules.md#3-todo-staging--todo-prod) |
| signaler une PR qui doit partir avant la tienne | [PRs Dependency](docs/pull-request-rules.md#4-prs-dependency) |
| relier les PR d'un même lot de travail | [Related PRs](docs/pull-request-rules.md#5-related-prs) |
| savoir quand poser `Ready` ou `Not Ready` sur une Pull Request | [Description](docs/pull-request-rules.md#règles-générales) |
| joindre des captures d'écran à une Pull Request | [Captures d'écran](docs/pull-request-rules.md#6-captures-décran) |
| décrire une mise à jour de sécurité | [PR de mise à jour de sécurité](docs/pull-request-rules.md#7-pr-de-mise-à-jour-de-sécurité) |
| voir une Pull Request complète et bien écrite | [Exemple complet](docs/pull-request-rules.md#8-exemple-complet) |
| relire une Pull Request avant de l'ouvrir | [Checklist](docs/pull-request-rules.md#10-checklist-avant-douvrir-la-pr) |
| comprendre pourquoi le check « PR rules » échoue | [Vérification automatique](docs/pull-request-rules.md#9-vérification-automatique) |

## Faire évoluer ces règles

Toute évolution passe par une Pull Request sur ce dépôt. [Maintenir ce dépôt](docs/maintaining.md) explique comment ces règles s'appliquent aux autres dépôts, comment activer la vérification automatique sur un dépôt et comment ajouter une documentation.
