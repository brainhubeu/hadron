process.env.NODE_ENV = 'test';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('babel-register')();
require('babel-polyfill');

const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSubset = require('chai-subset');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiSubset);
