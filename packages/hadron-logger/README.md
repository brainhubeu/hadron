# Logger for Hadron

## Overview

Hadron Logger provides an option to replace the default hadron logger ([bunyan](https://github.com/trentm/node-bunyan)) to the one of your choice.

## Installation

```bash
npm install @brainhubeu/hadron-logger --save
```

[More info about installation](http://hadron-docs.dev.brainhub.pl/core/#installation)

## Initialization

Pass the package as an argument for the Hadron bootstrapping function:

```javascript
// ... importing and initializing other components

hadron(expressApp, [require('@brainhubeu/hadron-logger')], config);
```

That way, you should be able to get it from the [Container](http://hadron-docs.dev.brainhub.pl/core/#dependency-injection) like that:

```javascript
const logger = container.take('logger');
logger.log('Hello, I am your logger');
logger.warm('Look out! I am your logger!');
logger.debug('Am I your logger?');
logger.error('I am not your logger!');
```

Notice: `logger` is a container key only for the default logger.

## Configuration

To setup your own logger, you need to provide an adapter first. You can do that by importing the `registerAdapter` method and calling it with name and provider function for your logger, like that:

```javascript
const registerAdapter = require('@brainhubeu/hadron-logger').registerAdapter;
registerAdapter('myOwnLogger', function(config) {
  return {
    log: function(message) {
      console.log(message);
    },
    warn: function(message) {
      console.warn(message);
    },
    debug: function(message) {
      console.debug(message);
    },
    error: function(message) {
      console.error(message);
    },
  };
});
```

Provider takes the Hadron logger config as the first parameter.

After your adapter is set up, you can define your logger in the Hadron configuration and retrieve it using the logger's name.

```javascript
const hadronConfig = {
  // ...other stuff
  logger: {
    name: 'myLoggerName',
    type: 'myOwnLogger',
  },
};

// hadron initialization

const logger = Container.take('myLoggerName');
```

## Multiple loggers

You can define multiple loggers for your application. To do that you just need to provide adapters for each of them and define them in the configuration.

```javascript
const hadronConfig = {
  // ...other stuff
  logger: [
    { name: 'Logger1', type: 'logger1' },
    { name: 'logger2', type: 'logger2' },
    { name: 'logger3', type: 'logger3' },
  ],
};

// hadron initialization

container.take('Logger1');
container.take('Logger2');
container.take('Logger3');
```
