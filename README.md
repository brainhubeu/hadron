<p align="center">
  <a href="https://hadron.pro/" target="blank">
  <img src="./logo3.png" alt="Hadron Logo" /></a>
</p>

[![CircleCI](https://circleci.com/gh/brainhubeu/hadron.svg?style=svg)](https://circleci.com/gh/brainhubeu/hadron)

## Why?

**Hadron's purpose is to facilitate the building of Node.js applications:**

### Low-level framework-agnostic

Your application is built independently from other frameworks (Express, Koa). Hadron creates a layer between HTTP requests and your app written in plain Javascript.

Hadron abstracts away underlying request and response objects, providing simple data structures as input/output of your routes' handlers, making them simple to test and easy to deal with.

### Dependency injection

The dependency injection pattern enables you to easily change interface implementation. Hadron gives us the power to create SOLID applications.

Containers as a dependency management solution provides a convenient way to access all dependencies in functions.

### Modular structure

The modular structure enables you to add/remove packages or create your own extensions. Hadron provides a complete solution for request processing using separate packages.

Current packages:

* security management
* input validation
* database integration (through TypeORM)
* data serialization
* logging
* events handling
* CLI tool

Built with TypeScript, but it's primary target is JavaScript apps. Hadron’s API embraces current ECMAScript standards, with the cherry of good IDE support via codebase types declarations on top.

> To read more about hadron check out our article: [How to use Hadron?](https://brainhub.eu/blog/building-api-expressjs-and-hadron/)

## Installation

* Install Node.js. We recommend using the latest version, installation details on [nodejs.org](https://nodejs.org)

* Install following modules from npm:

```bash
npm install @brainhubeu/hadron-core @brainhubeu/hadron-express express --save
```

## Hello World app

Let's start with a simple Hello World app. It will give you a quick grasp of the framework.

```javascript
const hadron = require('@brainhubeu/hadron-core').default;
const express = require('express');

const port = 8080;
const expressApp = express();

const config = {
  routes: {
    helloWorldRoute: {
      path: '/',
      callback: () => 'Hello world!',
      methods: ['get'],
    },
  },
};

hadron(expressApp, [require('@brainhubeu/hadron-express')], config).then(() => {
  expressApp.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`),
  );
});
```

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

Run unit tests for each package:
```sh
npm run test:unit
```

Run unit tests for a single package:
```sh
npm run test:package <package name>
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
