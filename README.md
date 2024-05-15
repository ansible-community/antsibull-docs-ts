<!--
Copyright (c) Ansible Project
Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
SPDX-License-Identifier: BSD-2-Clause
-->

# antsibull-docs - TypeScript library for processing Ansible documentation markup

[![Discuss on Matrix at #antsibull:ansible.com](https://img.shields.io/matrix/antsibull:ansible.com.svg?server_fqdn=ansible-accounts.ems.host&label=Discuss%20on%20Matrix%20at%20%23antsibull:ansible.com&logo=matrix)](https://matrix.to/#/#antsibull:ansible.com)
[![REUSE badge](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/reuse.yml/badge.svg)](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/reuse.yml)
[![TypeScript badge](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/typescript.yml/badge.svg)](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/typescript.yml)
[![Codecov badge](https://img.shields.io/codecov/c/github/ansible-community/antsibull-docs-ts)](https://codecov.io/gh/ansible-community/antsibull-docs-ts)
[![REUSE status](https://api.reuse.software/badge/github.com/ansible-community/antsibull-docs-ts)](https://api.reuse.software/info/github.com/ansible-community/antsibull-docs-ts)

This is a TypeScript library for processing Ansible documentation markup. It is named after [the Python package of the same name](https://github.com/ansible-community/antsibull-docs/). It is the TypeScript/JavaScript version of the Python [antsibull-docs-parser](https://github.com/ansible-community/antsibull-docs-parser/) package, which is used by antsibull-docs.

## How to use this

The package is available on [npm](https://www.npmjs.com/package/antsibull-docs).

### Node.js (CommonJS modules)

```js
const { parse, toHTML } = require('antsibull-docs');

function convert() {
  return toHTML(parse(['First paragraph.', 'Second B(paragraph).']));
}
```

### Webpack (EcmaScript modules)

```ts
import { parse, toHTML } from 'antsibull-docs';

function convert(): string {
  return toHTML(parse(['First paragraph.', 'Second B(paragraph).']));
}
```

## How to develop on this

After checking out the repository, run

```shell
$ npm install
```

to install all required node packages. Afterwards you can run

```shell
$ npm build
```

to build the package as both ESM and CJS,

```shell
$ npm build:cjs:watch
$ npm build:esm:watch
```

to start a watch process which builds the package (as CJS or ESM) every time a file is modified,

```shell
$ npm test
```

to run the unit tests,

```shell
$ npm run test:coverage
```

to run the unit tests and output coverage stats,

```shell
$ npm run test:watch
```

to start a watch process which run tests every time a file is modified,

```shell
$ npm run test:coverage:watch
```

to start a watch process which run tests every time a file is modified and outputs coverage stats,

```shell
$ npm run lint
```

to run the linting,

```shell
$ npm run format:check
```

to check formatting with prettier, and

```shell
$ npm run format:write
```

to re-format the source files.

### Release

1. Update package version in `package.json` (and remove things like `-post0`).
2. Create `changelogs/fragments/<version>.yml` with a `release_summary` section.
3. Run `rm -rf dist && npm install && npm run build`.
4. Run `npm publish --dry-run` and check the output.
5. Make sure to run `npm run format:write`, especially if you updated this README.
6. Add modified files to git (if they are OK) and commit with message `Prepare <version>.`.
7. Run `antsibull-changelog release` and add the updated files to git.
8. Commit with message `Release <version>.` and run `git tag <version>`.
9. Run `git push upstream main && git push`.
10. Once CI passes on GitHub, run `npm publish`.
11. On success, do `git push upstream --tags` and create a GitHub release.
12. Add `-post0` to the version in `package.json`, run `npm install`, commit as `Post-release version bump.`, and push to GitHub.
