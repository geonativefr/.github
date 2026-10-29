// Tests of the rules embedded in .github/workflows/pr-rules.yml.
// The script is read from the workflow itself, between its BEGIN and END
// markers, so what is tested is exactly what runs on the pull requests.
// Run with: node --test tests/*.test.mjs

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const workflow = readFileSync(new URL('../.github/workflows/pr-rules.yml', import.meta.url), 'utf8')
const block = workflow.split('\n')
const start = block.findIndex((l) => l.trim() === '// BEGIN rules')
const end = block.findIndex((l) => l.trim() === '// END rules')
assert.ok(start >= 0 && end > start, 'BEGIN and END rules markers must be in the workflow')
const indent = block[start].match(/^\s*/)[0].length
const source = block.slice(start + 1, end).map((l) => l.slice(indent)).join('\n')
const { checkPullRequest } = new Function(source + '\nreturn { checkPullRequest }')()

const check = (title, body, conventional = true) => checkPullRequest({ title, body, conventional })
const hasError = (errors, fragment) => errors.some((e) => e.includes(fragment))

const GOOD_BODY = `Add a CSV export to the invoices list so accountants can pull a month of invoices into their own tools.
The export respects the active filters.

Exports above 5,000 rows are queued instead of streamed.

**TODO Staging:**
- [ ] In \`/etc/app/app.env\` on \`staging-api-01\`, set \`EXPORT_QUEUE\` to \`exports\`
- [ ] Restart the \`app-worker\` service on \`staging-api-01\`

**TODO Prod:**
- [ ] In \`/etc/app/app.env\` on \`prod-api-01\`, set \`EXPORT_QUEUE\` to \`exports\`
- [ ] Restart the \`app-worker\` service on \`prod-api-01\`

**PRs Dependency:**
- https://github.com/acme/api/pull/412

**Related PRs:**
- https://github.com/acme/web/pull/1203
`

test('a pull request that follows every rule passes', () => {
  assert.deepEqual(check('feat(invoices): add CSV export', GOOD_BODY), [])
})

test('a summary alone, with no section, passes', () => {
  assert.deepEqual(check('fix(auth): refresh expired session tokens', 'Refresh the session token when it expires instead of logging the user out.'), [])
})

test('HTML comments left from the template are ignored', () => {
  assert.deepEqual(check('docs: fix typo in README', '<!--\nRules: see docs; delete unused sections\n-->\nFix a typo in the install section of the README.'), [])
})

test('title: too long, semicolon, not conventional', () => {
  assert.ok(hasError(check('test(device-server): stop the listen tests on their awaited event instead of a fixed timer', 'Fix it.'), 'characters'))
  assert.ok(hasError(check('feat(api): add export; update docs', 'Add it.'), 'Title: no semicolon'))
  assert.ok(hasError(check('Added pagination', 'Add it.'), '<type>(<scope>)'))
  assert.deepEqual(check('Add pagination to users endpoint', 'Add it.', false), [])
})

test('description: empty, heading, semicolon, trailer', () => {
  assert.ok(hasError(check('fix: a', ''), 'it is empty'))
  assert.ok(hasError(check('fix: a', '## Summary\nFix it.'), 'no heading'))
  assert.ok(hasError(check('fix: a', 'Fix it; also clean up.'), 'no semicolon in prose'))
  assert.ok(hasError(check('fix: a', 'Fix it.\n\nCo-Authored-By: Someone <a@b.c>'), 'trailer'))
})

test('semicolons in code are allowed', () => {
  assert.deepEqual(check('fix: a', 'Replace `a; b` with `a && b`.\n\n```sh\nset -e; make\n```\n'), [])
})

test('a section first, with no summary, fails', () => {
  assert.ok(hasError(check('fix: a', '**TODO Prod:**\n- [ ] Restart `api` on `prod-api-01`'), 'start with a 3 to 5 line summary'))
})

test('sections out of order fail', () => {
  const body = 'Fix it.\n\n**Related PRs:**\n- https://github.com/a/b/pull/1\n\n**TODO Staging:**\n- [ ] Restart `api` on `staging-api-01`'
  assert.ok(hasError(check('fix: a', body), 'in this order'))
})

test('the template left as is fails on every empty section', () => {
  const rules = readFileSync(new URL('../docs/pull-request-rules.md', import.meta.url), 'utf8')
  const template = rules.split('### Gabarit')[1].split('```markdown\n')[1].split('```')[0].replace(/<[^>]*>/g, '')
  const errors = check('fix: a', 'Fix it.\n' + template)
  for (const name of ['TODO Staging', 'TODO Prod', 'PRs Dependency', 'Related PRs']) {
    assert.ok(hasError(errors, name + ': the section has no real item'), name)
  }
})

test('empty or none sections fail', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**Related PRs:**\n'), 'the section is empty'))
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**Related PRs:**\n- none'), 'no real item'))
})

test('a link on the label line fails', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**Related PRs:** https://github.com/a/b/pull/1'), 'stands alone'))
})

test('TODO items must be checkboxes', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**TODO Prod:**\n- Restart `api` on `prod-api-01`'), 'must be a checkbox'))
})

test('TODO items stand alone and hold one action', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**TODO Prod:**\n- [ ] Same as staging'), 'points to another item'))
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**TODO Prod:**\n- [ ] Set `X` to `1` then restart `api`'), 'one action'))
  assert.deepEqual(check('fix: a', 'Fix it.\n\n**TODO Prod:**\n- [ ] Set `then=1` in `/etc/app.env` on `prod-api-01`'), [])
})

test('dependency and related items are bare pull request URLs', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**PRs Dependency:**\n- #412'), 'full pull request URL'))
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**PRs Dependency:**\n- https://github.com/a/b/pull/1 must ship first'), 'full pull request URL'))
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**Related PRs:**\n- [ ] https://github.com/a/b/pull/1'), 'no checkbox'))
})

test('a dependency is not listed again in Related PRs', () => {
  const body = 'Fix it.\n\n**PRs Dependency:**\n- https://github.com/a/b/pull/1\n\n**Related PRs:**\n- https://github.com/a/b/pull/1'
  assert.ok(hasError(check('fix: a', body), 'already a dependency'))
})

test('a misspelled section label is reported', () => {
  assert.ok(hasError(check('fix: a', 'Fix it.\n\n**Related PR:**\n- https://github.com/a/b/pull/1'), 'unknown section'))
})

test('prose after the sections fails', () => {
  const body = 'Fix it.\n\n**Related PRs:**\n- https://github.com/a/b/pull/1\n\nGenerated with some tool'
  assert.ok(hasError(check('fix: a', body), 'is not a list item'))
})
