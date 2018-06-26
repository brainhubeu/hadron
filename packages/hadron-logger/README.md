# Logger for Hadron

## Overview

Hadron Logger provides option to replace default hadron logger ([bunyan](https://github.com/trentm/node-bunyan)) to the one of your choice.

## Installation

```bash
npm install @brainhubeu/hadron-logger --save
```

[More info about installation](http://hadron-docs.dev.brainhub.pl/core/#installation)

## Initialization

Pass package as an argument for hadron bootstrapping function:

```javascript
// ... importing and initializing other components

hadron(expressApp, [require('@brainhubeu/hadron-logger')], config);
```

That way, You should be able to get it from [Container](http://hadron-docs.dev.brainhub.pl/core/#dependency-injection) like that:

```javascript
const logger = container.take('logger');
logger.log('Hello, I am your logger');
logger.warm('Look out! I am your logger!');
logger.debug('Am I your logger?');
logger.error('I am not your logger!');
```

Notice: `logger` is a container key for default logger only.

## Configuration

To setup your own logger, You need to provide a proper adapter first. You can do that by importing `registerAdapter` method and call it with name and provider function for your logger, like that:

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

Provider will get hadron logger config as first parameter.

After your adapter is setup, you can define Your logger in hadron configuration and retrieve it using logger name.

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

You can defined multiple loggers for your application. To do that You just need to provide adapters for all of them and define them in configuration.

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
