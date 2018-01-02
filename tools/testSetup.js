process.env.NODE_ENV = 'test';

// add needed chai/sinon plugins here
const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');

chai.use(sinonChai);
chai.use(dirtyChai);
