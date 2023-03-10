<!--
Copyright (c) Ansible Project
Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
SPDX-License-Identifier: BSD-2-Clause
-->

# antsibull-docs - TypeScript library for processing Ansible documentation markup

[![REUSE badge](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/reuse.yml/badge.svg)](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/reuse.yml)
[![TypeScript badge](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/typescript.yml/badge.svg)](https://github.com/ansible-community/antsibull-docs-ts/actions/workflows/typescript.yml)

This is a TypeScript library for processing Ansible documentation markup. It is named after [the Python package of the same name](https://github.com/ansible-community/antsibull-docs/).

## How to develop on this

After checking out the repository, run

```shell
$ npm install
```

to install all required node packages. Afterwards you can run

```shell
$ npm build
```

to build the package,

```shell
$ npm build:watch
```

to start a watch process which builds the package every time a file is modified,

```shell
$ npm test
```

to run the unit tests,

```shell
$ npm test:watch
```

to start a watch process which run tests every time a file is modified,

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
