# Brainhub framework app

## Getting Started

#### Requirements

* Installed GIT
* Installed node.js (we recommend using [nvm](https://github.com/creationix/nvm) to run multiple versions of node).

We recommend using latest (9.x) version of node. If you want to use older versions you may need to add [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) to use [some features](http://node.green/).

#### Clone it

```sh
git clone ssh://git@git.brainhub.pl:2222/brainhub-framework/brainhub-framework-app.git
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

## Documentation

1.  [Directory structure](docs/directoryStructure)

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
