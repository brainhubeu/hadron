import { expect } from 'chai';
import * as sinon from 'sinon';
import container from '../container/container';

import hadronCore from '../hadronCore';

describe('hadronCore()', () => {
  const mockRegister = sinon.stub(container, 'register');

  beforeEach(() => {
    return mockRegister.reset();
  })

  after(() => {
    return mockRegister.restore();
  });

  it('should return promise with Container instance', () => {
    return hadronCore({})
      .then(returnedContainer => expect(returnedContainer).to.equal(container),
    );
  })

  it('should register server in container', () => {
    const server = { call: 'I am server!' };
    return hadronCore(server)
      .then(returnedContainer =>
        expect(mockRegister.calledWith('server', server)).to.be.eql(true),
      );
  })

  it('should run register function from given package', () => {
    const server = { call: 'I am server!' };
    const mockPackage = { register: sinon.spy() };
    return hadronCore(server, [mockPackage])
      .then(returnedContainer =>
        expect(mockPackage.register.calledOnce).to.be.eql(true),
      );
  })

  it('should include given config to hadron configuration and pass it to register function of package', () => {
    const testConfig = {
      testField: 'I am test!',
    };
    const server = { call: 'I am server!' };
    const mockPackage = { register: sinon.spy() };
    return hadronCore(server, [mockPackage], testConfig)
      .then(returnedContainer =>
        // second argument, which should be config
        expect(mockPackage.register.args[0][1]).to.contain(testConfig),
      );
  });
});

