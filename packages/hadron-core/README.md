## Installation

* Install Node.js. We recommend using the latest version, installation details on [nodejs.org](https://nodejs.org)
* Add private npm registry:

```sh
# Set registry:
npm set registry http://npm.brainhub.pl

# Add account (follow the steps required by command):
npm adduser --registry  http://npm.brainhub.pl
```

* Install following modules from npm:

```bash
npm install @brainhubeu/hadron-core @brainhubeu/hadron-express express --save
```

## Hello world app

Let's start with traditional Hello World app. It will give you a quick grasp of the framework.

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

In the sections below, we will describe step by step what just happened.

## Bootstrapping an app

The main hadron-core function is responsible for bootstrapping the app. It registers packages based on passed config and server instance:

```javascript
const hadron = require('hadron-core').default;

hadron(serverInstance, [...packages], config);
```

The purpose of the main function is to initialize DI container and register package dependencies according to correspondent sections in config object (described in details in next chapters).

Main function returns a promise that resolves to created DI container instance. In the promise `.then()` method, besides performing operations on the container instance, we can actually start our server, by calling Express `listen` method:

```javascript
hadron(serverInstance, ...rest).then((container) => {
  // do some things on container...

  serverInstance.listen(PORT, callback);
});
```

Now, let's move to DI container itself.

## Dependency Injection

The whole framework is built around DI Container concept. Its purpose is to automatically supply proper arguments for routes callbacks and other framework's building blocks.

DI container instance is created and used internally by bootstrapping function, it is also returned (as a promise) from bootstrapping function, as mentioned in the previous section.

### Container methods

#### Registering items

```javascript
container.register(key, item, lifetime);
```

* `key` - item name on which it will be registered inside the container
* `item` - any value (primitive, data structure, function, class, etc.)
* `lifetime` - the type of item's life-span

Lifetime options:

* `'value'` - container returns registered item as is [default]
* `'singleton'` - returns always the same instance of registered class / constructor function
* `'transient'` - returns always a new instance of registered class / constructor function

#### Retrieving items

```javascript
container.take(key);
```

* `key` - item name (same as provided during registration)

The method returns item or item instance according to item type and lifetime option.

#### Example usage in bootstrapping function

```javascript
const { default: hadron, Lifetime } = require('hadron-core');

hadron(...args).then((container) => {
  container.register('foo', 123);
  container.register('bar', class Bar {}, Lifetime.Singleton);
  container.register('baz', class Baz {}, Lifetime.Transient);

  // other stuff...
});
```

### Accessing container items from routes' callbacks

To access container items from callbacks, you can just set arguments' names to match container keys, and required dependency will be provided.

See an example [here](../routing/#retrieving-items-from-container-in-callback)
