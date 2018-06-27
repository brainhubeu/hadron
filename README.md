<p align="center">
  <a href="https://hadron.pro/" target="blank"><img src="https://api.media.atlassian.com/file/a8d478e9-f267-4f6c-be9f-5f5172fadab4/binary?token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIzNTM3NmZmMi1kM2IzLTRkNGEtYTRlOC0wNDJmNGVjYzYzNTEiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpmaWxlOmI1OTk2NDJjLWY0YzQtNDhmNS1hNzJmLWFjYmEwYzc1MzU1MyI6WyJyZWFkIl0sInVybjpmaWxlc3RvcmU6ZmlsZTozZDA5ZmYxMC03ODcxLTQ3ZTAtOTQ2YS04MjgxZmZhNWMyZTIiOlsicmVhZCJdLCJ1cm46ZmlsZXN0b3JlOmZpbGU6NTk0Y2I2Y2YtZDQxMS00MjFhLWFmMDUtNmJjOTVhYjE4NWMwIjpbInJlYWQiXSwidXJuOmZpbGVzdG9yZTpmaWxlOmE4ZDQ3OGU5LWYyNjctNGY2Yy1iZTlmLTVmNTE3MmZhZGFiNCI6WyJyZWFkIl0sInVybjpmaWxlc3RvcmU6ZmlsZTpmZmQxZWE0Ni0wZjlhLTQ4OTUtYWE5MC0wYzg3NmM0ZWM4YmQiOlsicmVhZCJdLCJ1cm46ZmlsZXN0b3JlOmZpbGU6MTU5OGJjYTEtYzc5Ny00ZWZiLTgwOGEtODkyOGJlMWM1ODM3IjpbInJlYWQiXSwidXJuOmZpbGVzdG9yZTpmaWxlOjQxOGEwYjBkLTdlNzktNDBkMC04Y2NkLTk3MTBmMTM3MDRjZiI6WyJyZWFkIl19LCJleHAiOjE1MzAwOTIyODcsIm5iZiI6MTUzMDA5MTMyN30.yFPS1y3ICbPIVI4R1nUsbhkN6nf_iMSIoBDkYIxTgYE&client=35376ff2-d3b3-4d4a-a4e8-042f4ecc6351" width="200" alt="Nest Logo" /></a>
</p>

# Hadron
>Makes backend services creation easier.

## Why?
Hadron is a high-level Node.js framework built on top of Express (with support for other micro frameworks coming in the future).

It abstracts away underlying request and response objects, providing simple data structures as input and output of your routes' handlers, making them simple to test and easy to deal with.

Thanks to using dependency injection containers as a central dependency management solution, it provides a convenient way to access all dependencies in handler functions.

Hadron is modular, in addition to core functionalities mentioned above we provide a complete solution for requests processing via separate packages:

* security management
* input validation
* database integration (through TypeORM)
* data serialization
* logging
* events handling
* CLI tool

Hadron is built with TypeScript, but it's primary target are JavaScript apps - we build our API to embrace current ECMAScript standards, with the cherry of good IDE support via codebase types declarations on top.

[![CircleCI](https://circleci.com/gh/brainhubeu/hadron.svg?style=svg)](https://circleci.com/gh/brainhubeu/hadron)

## Documentation

Hadron documentation can be found at [http://hadron.pro](http://hadron.pro)

## Getting Started

#### Requirements

* Installed GIT
* Installed node.js (we recommend using [nvm](https://github.com/creationix/nvm) to run multiple versions of node).

We recommend using latest version of node. If you want to use older versions you may need to add [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to use [some features](http://node.green/).

#### Clone it

```sh
git clone git@github.com:brainhubeu/hadron.git
cd brainhub-framework-app
```

#### Install dependencies

```sh
npm install
```

#### Run development server

```sh
npm run dev
```

#### Run production server

```sh
npm start
```

## Running tests

#### All tests

```sh
npm run test
# or
PORT=8181 npm run test
```

#### Unit tests

```sh
npm run test:unit
```

#### E2E tests

```sh
PORT=8181 npm run test:e2e
```

It will run `test.sh` script which in turn, will run app, wait for it to start listening and run `npm run test:cucumber` command.
You need to provide the script with valid PORT or default (8080) will be used.

#### Linter

```sh
npm run lint        # to just show linter errors and warnings
npm run lint:fix    # to fix the errors and show what's left
```

### Typescript types management

**Note!** Because we're using `"noImplicitAny": true`, we are required to have a `.d.ts` file for **every** library we use. While we could set `noImplicitAny` to `false` to silence errors about missing `.d.ts` files, it is a best practice to have a `.d.ts` file for every library.

1.  After installing any npm package as a dependency or dev dependency, immediately try to install the `.d.ts` file via `@types`. If it succeeds, you are done. If not, continue to next step.
2.  Try to generate a `.d.ts` file with dts-gen. If it succeeds, you are done. If not, continue to next step.
3.  Create a file called `<some-library>.d.ts` in `types` folder.
4.  Add the following code:

```ts
declare module '<some-library>';
```

5.  At this point everything should compile with no errors and you can either improve the types in the `.d.ts` file by following this [guide on authoring `.d.ts` files](http://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) or continue with no types.

## Lerna

1.  To run `npm i` on all packages, and compile them, just run

```bash
  lerna bootstrap
```

2.  To run any command on all packages, just can use `exec` command.
    F.e. to compile all packages, you can run

```bash
  lerna exec tsc
```

3.  To clean all `node_modules` in packages, run

```bash
  lerna clean
```

4.  To clean all `node_modules` AND `dist` directories, run

```bash
  npm run clean
```

5.  To add dependency between packages, run

```bash
  lerna add <source-package-name> --scope=<target-package-name1>, <target-package-name2>
```

6.  To publish to npm, run

```bash
  lerna publish
```

To get more command, please visit this [link](https://github.com/lerna/lerna).