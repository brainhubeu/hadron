# Brainhub framework app

## Getting Started

#### Requirements
- Installed GIT
- Installed node.js (we recommend using [nvm](https://github.com/creationix/nvm) to run multiple versions of node).

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

## Documentation
*nothing to see here yet*