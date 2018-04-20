## Installation

```bash
npm install @brainhubeu/hadron-json-provider --save
```

[More info about installation](/core/#installation)

## Overview

JSON Provider allows you to automatically load multiple files as JSON object, with file names as object keys, and files data as object values.
Currently we support following extensions:

* `.js`
* `.json`
* `.xml`

## Module functions

### Basic provider

```javascript
jsonProvider(paths, extensions);
```

* `paths` - array of strings which contains paths to files
* `extensions` - array of strings which contains extensions of files from which you want to build an JSON object

For example, having directory with the following structure:

![Directory structure](img/routing.png)

To find all files in `./routing` and its sub-directories with extension `config.js` you can use following code:

```javascript
jsonProvider(['./routing/**/*'], ['config.js'])
  .then((object) => {})
  .catch((error) => {});
```

### Configuration Provider

```javascript
configJsonProvider(paths, configFile, projectType, extensions);
```

* `paths` - array of strings which contains paths to files
* `configFile` - name of main configuration file
* `projectType` - project type
* `extensions` - array of strings which contains extensions of files from which you want to build an JSON object

For example, having directory with the following structure:

![Directory structure](img/routingType.png)

If you want to build configuration object which depends on project type, for example `development` you can use following code

```javascript
configJsonProvider(['./app/config/*'], 'config', 'development', ['xml', 'js'])
  .then((object) => {})
  .catch((error) => {});
```
