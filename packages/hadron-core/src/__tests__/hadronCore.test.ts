import { expect } from 'chai';
import * as sinon from 'sinon';
import container from '../container/container';

import hadronCore, { prepareConfig } from '../hadronCore';

describe('prepareConfig()', () => {
  const logger = { error: sinon.spy() };
  const defaultConfig = { prop1: 1, prop2: 2 };

  it('should accept object', () => {
    const config = { prop2: 4, prop3: 5 };
    const expectedResult = { prop1: 1, prop2: 4, prop3: 5 };
    return prepareConfig(defaultConfig, config, logger).then((resolvedConfig) =>
      expect(resolvedConfig).to.deep.equal(expectedResult),
    );
  });

  it('should accept promise, which returns object', () => {
    const config = new Promise((res, rej) => res({ prop2: 4, prop3: 5 }));
    const expectedResult = { prop1: 1, prop2: 4, prop3: 5 };
    return prepareConfig(defaultConfig, config, logger).then((resolvedConfig) =>
      expect(resolvedConfig).to.deep.equal(expectedResult),
    );
  });

  it('should log error when config promise is rejected', () => {
    const config = new Promise((res, rej) => rej());
    const loggerMock = { error: sinon.spy() };
    return prepareConfig(defaultConfig, config, loggerMock).catch((error) =>
      expect(loggerMock.error.called).to.be.eql(true),
    );
  });

  it('should return default config when config promise is rejected', () => {
    const config = new Promise((res, rej) => rej());
    return prepareConfig(defaultConfig, config, logger).then((resolvedConfig) =>
      expect(resolvedConfig).to.deep.equal(defaultConfig),
    );
  });
});

describe('hadronCore()', () => {
  const mockRegister = sinon.stub(container, 'register');

  beforeEach(() => {
    return mockRegister.reset();
  });

  after(() => {
    return mockRegister.restore();
  });

  it('should return promise with Container instance', () => {
    return hadronCore({}).then((returnedContainer) =>
      expect(returnedContainer).to.equal(container),
    );
  });

  it('should register server in container', () => {
    const server = { call: 'I am server!' };
    return hadronCore(server).then((returnedContainer) =>
      expect(mockRegister.calledWith('server', server)).to.be.eql(true),
    );
  });

  it('should run register function from given package', () => {
    const server = { call: 'I am server!' };
    const mockPackage = { register: sinon.spy() };
    return hadronCore(server, [mockPackage]).then((returnedContainer) =>
      expect(mockPackage.register.calledOnce).to.be.eql(true),
    );
  });

  it('should include given config to hadron configuration and pass it to register function of package', () => {
    const testConfig = {
      testField: 'I am test!',
    };
    const server = { call: 'I am server!' };
    const mockPackage = { register: sinon.spy() };
    return hadronCore(server, [mockPackage], testConfig).then(
      (returnedContainer) =>
        // second argument, which should be config
        expect(mockPackage.register.args[0][1]).to.contain(testConfig),
    );
  });
});
