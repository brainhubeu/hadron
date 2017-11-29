process.env.NODE_ENV = 'test';

// add needed chai/sinon plugins here
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
