# Règles de création des Pull Requests

Ce document fixe la façon d'écrire le **titre** et la **description** de toute Pull Request (PR) ouverte sur nos dépôts. Le but : qu'un relecteur comprenne la PR en quelques secondes et qu'une personne qui déploie sache exactement quoi faire, dans quel ordre, sur quel environnement.

> **Langue :** le contenu d'une PR (titre, description, commentaires) est toujours rédigé **en anglais**. Les exemples ci-dessous le sont donc aussi.

---

## 1. Titre

### Règles

- **Même convention que les commits du dépôt.** Vérifier avec `git log --format=%s -10` :
  - si le dépôt utilise Conventional Commits → `<type>(<scope>): <description>`
  - sinon → une phrase à l'impératif.
- **Impératif** : `add`, `fix`, `remove` — jamais `added`, `adds`, `fixing`.
- **Une seule ligne**, ~**60 caractères maximum** (72 au grand maximum).
- **Dit *quoi*, pas *comment* ni *pourquoi*** : l'explication va dans la description.
- **Aucun point-virgule.**

### Types Conventional Commits usuels

| Type | Usage |
|---|---|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Restructuration sans changement de comportement |
| `perf` | Amélioration de performance |
| `test` | Ajout ou correction de tests |
| `docs` | Documentation uniquement |
| `chore` / `build` / `ci` | Outillage, dépendances, pipeline |

### Exemples

| ❌ À éviter | ✅ Correct |
|---|---|
| `test(device-server): stop the listen tests on their awaited event instead of a fixed timer` | `test(device-server): fix flaky listen tests` |
| `Added pagination to the users endpoint` | `feat(api): add pagination to users endpoint` |
| `fix stuff` | `fix(auth): refresh expired session tokens` |
| `feat(api): add export; update docs` | `feat(api): add CSV export for invoices` |

---

## 2. Description

### Gabarit

Aucun gabarit n'est pré-rempli à l'ouverture d'une PR : la description est écrite par la personne ou l'agent qui l'ouvre, sur la forme de référence ci-dessous.

```markdown
<Résumé : de quoi il s'agit et ce que fait la PR, en 3 à 5 lignes>

<Ce que ça fait en détail — seulement si nécessaire>

<Explication de la partie complexe — seulement si nécessaire>

<Explication d'un choix non évident — seulement si nécessaire>

**TODO Staging:**
- [ ] <étape de déploiement staging>
- [ ] <étape suivante>

**TODO Prod:**
- [ ] <étape de déploiement prod>
- [ ] <étape suivante>

**PRs Dependency:**
- <url d'une PR qui doit partir avant celle-ci ou en même temps>

**Related PRs:**
- <url d'une PR réellement liée à ce travail>
```

### Règles générales

- **Aucun titre markdown.** La description commence directement par le texte du résumé — jamais de `## Summary`, `# Description`, etc.
- **Dire ce que fait la PR, pas ce qu'elle ne fait pas** : pas de liste d'omissions, d'alternatives écartées ou de choses laissées intactes.
- **Formuler les prérequis positivement** : « `X` must have `Y` set », et non « it will fail without `Y` ».
- **Aucun point-virgule** dans le texte (le code entre backticks ou dans un bloc de code peut en contenir).
- **Aucune ligne de signature** (`Co-Authored-By`, etc.).
- **Parler en termes métier et techniques uniquement** : aucune référence aux outils, assistants ou à l'organisation interne du travail utilisés pour écrire le code.
- **Toute PR est ouverte en Draft.** Elle passe en « Ready for review » seulement quand elle est réellement prête.
- **Toute PR porte exactement un label `Ready` ou `Not Ready`**, en plus du statut Draft :
  - elle s'ouvre en Draft et `Not Ready`
  - `Ready` se pose quand elle est réellement prête : à sa sortie de Draft, ou quand la méthode du projet la déclare prête
  - un nouveau push après cela remet `Not Ready`, jusqu'à ce qu'elle soit de nouveau prête
  - un dépôt qui n'a pas ces labels les crée avec ces noms exacts : `Ready` (couleur `27e760`) et `Not Ready` (couleur `8c1455`)

### Règles communes aux 4 sections

Les sections viennent **après le résumé**, **dans cet ordre exact** : TODO Staging → TODO Prod → PRs Dependency → Related PRs.

- **Forme stricte**, quel que soit le nombre d'éléments :
  - le label en gras, **seul sur sa ligne** (`**TODO Staging:**`)
  - puis **un élément par ligne**, rien d'autre sur la ligne
  - jamais de titre markdown, jamais de lien sur la même ligne que le label
- **Chaque section est optionnelle** : présente seulement si elle sert. **Jamais vide**, jamais `none`, `N/A` ou `-`.

---

## 3. TODO Staging / TODO Prod

### Quand les mettre

Une section TODO est **obligatoire dès qu'il y a quelque chose à faire au déploiement** : variable d'environnement, migration, configuration, redémarrage d'un service, purge de cache, feature flag, ordre de déploiement…

### Règles

1. **Toujours une case à cocher** `- [ ] <étape>`, jamais une simple puce `- `. La personne qui déploie coche au fur et à mesure.
2. **Staging et Prod toujours séparés**, même quand les étapes sont identiques : on les écrit alors dans les deux sections.
3. **Chaque étape est autonome.** Elle ne renvoie jamais à une autre (« same as above », « do the same edit », « likewise »). Elle écrit l'action en entier :
   - le **fichier** ou la ressource concernée
   - la **valeur avant et après**
   - l'**hôte ou l'environnement**
4. **Une case = une action.** Une modification et le redémarrage / reload / déploiement / migration qui l'applique font **deux cases**, jamais reliées par « then » ou « and run ».
5. **Ordre explicite** quand il n'est pas libre (ex. la PR API doit partir strictement avant la PR infra) : la TODO le dit noir sur blanc.

### Exemples

❌ À éviter :

```markdown
**TODO Staging:**
- set the env var then restart the worker

**TODO Prod:**
- same as staging
```

✅ Correct :

```markdown
**TODO Staging:**
- [ ] Merge and deploy https://github.com/acme/api/pull/412 before this PR
- [ ] In `/etc/app/worker.env` on `staging-worker-01`, change `QUEUE_CONCURRENCY` from `4` to `8`
- [ ] Restart the `app-worker` service on `staging-worker-01`
- [ ] Run `php artisan migrate` on `staging-api-01`

**TODO Prod:**
- [ ] Merge and deploy https://github.com/acme/api/pull/412 before this PR
- [ ] In `/etc/app/worker.env` on `prod-worker-01`, change `QUEUE_CONCURRENCY` from `4` to `8`
- [ ] Restart the `app-worker` service on `prod-worker-01`
- [ ] Run `php artisan migrate` on `prod-api-01`
```

---

## 4. PRs Dependency

### Définition

Liste les PRs qui **doivent être livrées avant celle-ci ou en même temps**. Si celle-ci part seule, elle casse quelque chose.

### Règles

- Une puce simple `- <url>` par PR (pas de case à cocher).
- **L'URL seule sur sa ligne** : c'est le retour à la ligne + le tiret qui font que GitHub affiche chaque lien sous forme de carte PR avec son statut.
- Si l'ordre de livraison est contraint (strictement avant, et non « en même temps »), **le préciser dans les TODO**.

### Exemple

```markdown
**PRs Dependency:**
- https://github.com/acme/api/pull/412
- https://github.com/acme/infra/pull/88
```

---

## 5. Related PRs

### Définition

Liste les PRs **réellement liées** à ce travail :

- ✅ PR du **même lot** de travail (même feature découpée en plusieurs PRs, même ticket sur plusieurs dépôts)
- ✅ PR **à l'origine du bug** corrigé ici
- ✅ tout lien de cette force

Ne pas y mettre :

- ❌ un lien lointain (« touche aussi au module auth »)
- ❌ une **PR de suite** (follow-up, qui devra venir *après* celle-ci)
- ❌ une PR déjà listée dans **PRs Dependency**

### Règles de forme

Identiques à PRs Dependency : `- <url>`, une par ligne.

### Exemple

```markdown
**Related PRs:**
- https://github.com/acme/web/pull/1203
- https://github.com/acme/api/pull/398
```

---

## 6. Captures d'écran

### Définition

Une capture montre à la relecture ce que la PR change à l'écran, sans avoir à lancer la branche.

### Règles

- **Toute PR qui change quelque chose de visible** (un écran, un composant, une mise en page, un style, un texte affiché à l'utilisateur) **porte des captures** dans sa description. Une PR sans changement visible n'en porte aucune.
- **Avant ET après**, pour chaque écran modifié : le relecteur voit la différence sans lancer la branche.
- **Bureau ET mobile** sur un projet qui a une version mobile : le changement doit fonctionner à la largeur d'un téléphone, et une PR d'un tel projet n'est pas prête sans les deux.
- **Une fenêtre qui affiche du contenu** (liste, historique, frise) est capturée ouverte, et sur mobile elle occupe la largeur de l'écran.
- **Chaque capture porte un titre descriptif, seul sur sa ligne juste au-dessus de l'image** : l'écran, l'état montré, la taille d'écran, et avant ou après.
- **Le couple avant / après est pris sur les mêmes données, la même taille d'écran et le même zoom**, pour que les deux images se comparent ligne à ligne.
- **Chaque image montre ce que la PR change, lisible à sa taille** : pas un écran entier quand le changement tient en quelques pixels, pas un panneau fermé quand le changement est à l'intérieur.
- **Aucune donnée personnelle, adresse email, jeton, secret ou nom de client réel visible**, et rien de tronqué ou qui déborde sans que la PR l'ait voulu.
- **Les images sont déposées dans la description** (glissées dans GitHub), jamais commitées dans le dépôt.
- **Emplacement** : après le résumé et ses paragraphes optionnels, avant `**TODO Staging:**`.

### Exemples de titres

| ❌ À éviter | ✅ Correct |
|---|---|
| `Screenshot 1` | `Devices list, last alert column, desktop 1440 px, after` |
| `image.png` | `Devices list, last alert column, mobile 390 px, before` |
| `after` | `Export dialog, open with a month of invoices, mobile 390 px, after` |

### Exemple

```markdown
Add a last alert column to the devices list so operators spot a silent device at a glance.
The column shows the date of the latest alert and stays readable at phone width.

Devices list, last alert column, desktop 1440 px, before
<image>

Devices list, last alert column, desktop 1440 px, after
<image>

Devices list, last alert column, mobile 390 px, before
<image>

Devices list, last alert column, mobile 390 px, after
<image>

**TODO Staging:**
- [ ] Run `php artisan migrate` on `staging-api-01`
```

Dans la description réelle, `<image>` est l'image glissée dans GitHub, qui s'écrit `![alt](url)`.

---

## 7. PR de mise à jour de sécurité

### Définition

Une PR qui met à jour des dépendances pour corriger des avis de sécurité publiés ouvre sa description par une première ligne et des tableaux, à la place du résumé. Les sections du gabarit (TODO, dépendances…) suivent si nécessaire, avec leurs règles. Une description dont la première ligne nomme un identifiant CVE est lue comme une mise à jour de sécurité et exige ses tableaux.

### Règles

- **Première ligne** : les paquets, la version vers laquelle ils passent et chaque identifiant CVE corrigé par la PR.
- **Un tableau par avis**, dans l'ordre de la première ligne, une ligne vide entre deux tableaux.
- **En-tête vide** (`| | |`) et **quatre lignes toujours dans cet ordre** : Package, Advisory, Affected, Reference.
- **Package** : le paquet dans un code span, puis sa version verrouillée et la nouvelle, précédé de `dev dependency, ` quand c'en est une.
- **Advisory** : l'identifiant propre à l'avis tel que l'audit l'affiche (`PKSA-…`, `GHSA-…`), l'identifiant CVE, le titre de l'avis, puis sa sévérité en gras quand l'avis en donne une. Un avis sans CVE met son identifiant GHSA à la place du CVE, lui aussi en lien.
- **Affected** : chaque plage affectée dans son propre code span.
- **Reference** : l'URL de l'avis, seule.
- **Chaque identifiant CVE est un lien markdown vers son avis** (`[CVE-2026-12345](<url>)`), l'URL que l'audit affiche : jamais nu et jamais dans un code span. GitHub ne transforme un CVE nu en lien que s'il connaît l'avis dans sa propre base, et jamais dans un code span.

### Exemple

```markdown
acme/http, acme/router and acme/session to 4.2.1 ([CVE-2026-12345](https://example.com/advisories/GHSA-aaaa-bbbb-cccc), [CVE-2026-67890](https://example.com/advisories/GHSA-dddd-eeee-ffff))

| | |
|---|---|
| Package | `acme/http` (locked at 4.1.0, now 4.2.1) |
| Advisory | GHSA-aaaa-bbbb-cccc / [CVE-2026-12345](https://example.com/advisories/GHSA-aaaa-bbbb-cccc) — Header injection in redirects, **high** |
| Affected | `>=4.0.0,<4.2.1` |
| Reference | https://example.com/advisories/GHSA-aaaa-bbbb-cccc |

| | |
|---|---|
| Package | `acme/router` (locked at 4.1.0, now 4.2.1) |
| Advisory | GHSA-dddd-eeee-ffff / [CVE-2026-67890](https://example.com/advisories/GHSA-dddd-eeee-ffff) — Path traversal in static routes, **moderate** |
| Affected | `>=3.5.0,<3.9.2` and `>=4.0.0,<4.2.1` |
| Reference | https://example.com/advisories/GHSA-dddd-eeee-ffff |
```

---

## 8. Exemple complet

**Titre :**

```
feat(invoices): add CSV export
```

**Description :**

```markdown
Add a CSV export to the invoices list so accountants can pull a month of invoices into their own tools.
The export is available from the invoices page through a new Export button and respects the active filters.
Large exports are generated by a background job and sent by email once ready.

Exports above 5,000 rows are queued instead of streamed, because streaming them held a PHP worker for more than a minute and starved the other requests.

**TODO Staging:**
- [ ] Merge and deploy https://github.com/acme/api/pull/412 before this PR
- [ ] In `/etc/app/app.env` on `staging-api-01`, set `EXPORT_QUEUE` to `exports`
- [ ] Restart the `app-worker` service on `staging-api-01`

**TODO Prod:**
- [ ] Merge and deploy https://github.com/acme/api/pull/412 before this PR
- [ ] In `/etc/app/app.env` on `prod-api-01`, set `EXPORT_QUEUE` to `exports`
- [ ] Restart the `app-worker` service on `prod-api-01`

**PRs Dependency:**
- https://github.com/acme/api/pull/412

**Related PRs:**
- https://github.com/acme/web/pull/1203
```

---

## 9. Vérification automatique

> **À venir** : ce check n'est pas encore activé sur les dépôts de l'organisation. Sa date d'activation sera indiquée ici.

Le check **PR rules / Title and description** tourne sur chaque PR, à l'ouverture et à chaque modification du titre ou de la description. Il vérifie les règles qu'un script peut trancher sans jugement :

- titre : format Conventional Commits, longueur, point-virgule
- description : présence du résumé, aucun titre markdown, aucun point-virgule hors code, aucune ligne de signature
- sections : noms exacts, ordre, label seul sur sa ligne, jamais vides ni `none`
- TODO : cases à cocher, pas de renvoi à une autre étape, une action par case
- PRs Dependency / Related PRs : une URL de PR complète par ligne, pas de doublon entre les deux

Le reste (clarté du résumé, pertinence des Related PRs, anglais, complétude des TODO, captures d'écran, tableaux des mises à jour de sécurité, vocabulaire de la description) relève de la relecture.

Les PRs ouvertes par des bots (Dependabot, Renovate…) ne sont pas vérifiées.

---

## 10. Checklist avant d'ouvrir la PR

- [ ] Le titre suit la convention des commits du dépôt, à l'impératif
- [ ] Le titre tient sur une ligne, ~60 caractères, sans point-virgule
- [ ] La description commence directement par le résumé (aucun titre markdown)
- [ ] Le résumé fait 3 à 5 lignes et dit ce que fait la PR
- [ ] Aucune liste de ce que la PR ne fait pas
- [ ] Les captures d'écran sont jointes quand la PR change quelque chose de visible
- [ ] Elles montrent l'avant et l'après, sur les mêmes données et la même taille d'écran
- [ ] Bureau et mobile, quand le projet a une version mobile
- [ ] Chaque image a un titre descriptif sur la ligne au-dessus
- [ ] Une PR de mise à jour de sécurité a sa première ligne et un tableau par avis, chaque CVE en lien
- [ ] La description n'a aucune référence aux outils ou à l'organisation interne du travail
- [ ] Les sections sont dans l'ordre : TODO Staging, TODO Prod, PRs Dependency, Related PRs
- [ ] Aucune section vide ou marquée `none`
- [ ] Une section TODO existe s'il y a quoi que ce soit à faire au déploiement
- [ ] Staging et Prod sont séparés, même si identiques
- [ ] Chaque TODO est une case `- [ ]`, autonome, avec fichier / valeur / environnement
- [ ] Une case = une action (pas de « then » / « and run »)
- [ ] L'ordre de déploiement entre PRs est explicite quand il est contraint
- [ ] Les URLs de PR sont seules sur leur ligne, précédées de `- `
- [ ] Aucune PR de suite dans Related PRs
- [ ] Tout est en anglais, sans point-virgule
- [ ] La PR est ouverte en Draft
- [ ] La PR porte `Not Ready`, remplacé par `Ready` quand elle est prête
