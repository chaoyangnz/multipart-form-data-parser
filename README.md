[![Sponsor][sponsor-badge]][sponsor]
[![NPM version][npm-badge]][npm]
[![TypeScript version][ts-badge]][typescript-4-2]
[![Node.js version][nodejs-badge]][nodejs]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

# multipart-form-data-parser

A zero-dependency multipart data parser.

## Getting Started

```typescript
import {parser} from 'multipart-form-data-parser'

parse(Buffer.from('...'), 'boundary')
```

### Use as a repository template

Click the **[Use template][repo-template-action]** link (or the green button). Now start adding your code in the `src` and unit tests with `*.spec.ts`.

### Clone repository

To clone the repository use the following commands:

```sh
git clone https://github.com/chaoyangnz/multipart-form-data-parser
cd multipart-form-data-parser
npm install
```

### Download latest release

Download and unzip current `master` branch or one of tags:

```sh
wget https://github.com/chaoyangnz/multipart-form-data-parser/archive/master.zip -O multipart-form-data-parser.zip
unzip multipart-form-data-parser.zip && rm multipart-form-data-parser.zip
```

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests
- `release` - bump the version, commit, create release tag and publish to NPM registry

## License

Licensed under the MIT. See the [LICENSE](https://github.com/chaoyangnz/multipart-form-data-parser/blob/master/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.2-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2012.20-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[gha-badge]: https://github.com/chaoyangnz/multipart-form-data-parser/workflows/build/badge.svg
[gha-ci]: https://github.com/chaoyangnz/multipart-form-data-parser/actions
[typescript]: https://www.typescriptlang.org/
[typescript-4-2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/chaoyangnz/multipart-form-data-parser/blob/master/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/chaoyangnz
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[travis]: https://travis-ci.org
[repo-template-action]: https://github.com/chaoyangnz/multipart-form-data-parser/generate
[npm-badge]: https://img.shields.io/npm/v/multipart-form-data-parser
[npm]: https://www.npmjs.com/package/multipart-form-data-parser
