import hashMethodProvider from '../hashMethodProvider';
import { expect } from 'chai';
import * as sinon from 'sinon';

import ISecurityOptions from '../../ISecurityOptions';
import IHashMethod from '../IHashMethod';

describe('hashMethodProvider', () => {
  const defaultOptions = {
    roles: [],
  } as ISecurityOptions;

  it('should return bcrypt on default', () => {
    const bcryptSpy = sinon.spy();

    hashMethodProvider(defaultOptions, { bcrypt: bcryptSpy });
    return expect(bcryptSpy.calledOnce).to.be.equal(true);
  });

  it('should return method, which name was defined in config', () => {
    const testSpy = sinon.spy();

    const options = {
      ...defaultOptions,
      hash: {
        method: 'testMethod',
      },
    } as ISecurityOptions;

    hashMethodProvider(options, { testMethod: testSpy });
    return expect(testSpy.calledOnce).to.be.equal(true);
  });

  it("should return default method, if method name from config doesn't exists", () => {
    const bcryptSpy = sinon.spy();

    const options = {
      ...defaultOptions,
      hash: {
        method: 'testMethod',
      },
    } as ISecurityOptions;

    hashMethodProvider(options, { bcrypt: bcryptSpy });
    return expect(bcryptSpy.calledOnce).to.be.equal(true);
  });

  it('should return method defined in config', () => {
    const hashStub = sinon.spy();
    const method = {
      hash: hashStub,
      compare: (userPassword: string, hashedPassword: string) =>
        Promise.resolve(true),
    } as IHashMethod;

    const options = {
      ...defaultOptions,
      hash: {
        method,
      },
    } as ISecurityOptions;

    hashMethodProvider(options).hash('smth');

    return expect(hashStub.calledOnce).to.be.equal(true);
  });

  it('should return default method, if hash method defined in config is incorrect', () => {
    const bcryptSpy = sinon.spy();
    const method = {
      hassh: (userPassword: string, hashedPassword: string) =>
        Promise.resolve(true),
      compaare: (userPassword: string, hashedPassword: string) =>
        Promise.resolve(true),
    };

    const options = {
      ...defaultOptions,
      hash: {
        method,
      },
    };

    hashMethodProvider(options as any, { bcrypt: bcryptSpy });

    return expect(bcryptSpy.calledOnce).to.be.equal(true);
  });

  it('should pass options to hash method call of hashMethod', () => {
    const hashStub = sinon.spy();
    const method = {
      hash: hashStub,
      compare: (userPassword: string, hashedPassword: string) =>
        Promise.resolve(true),
    } as IHashMethod;

    const options = {
      ...defaultOptions,
      hash: {
        method,
        options: { lorem: 'ipsum' },
      },
    } as ISecurityOptions;

    hashMethodProvider(options).hash('smth');

    return expect(
      hashStub.calledWith('smth', undefined, { lorem: 'ipsum' }),
    ).to.be.equal(true);
  });

  it('should pass options to compare method call of hashMethod', () => {
    const compareStub = sinon.spy();
    const method = {
      hash: (userPassword: string) => Promise.resolve('password'),
      compare: compareStub,
    } as IHashMethod;

    const options = {
      ...defaultOptions,
      hash: {
        method,
        options: { lorem: 'ipsum' },
      },
    } as ISecurityOptions;

    hashMethodProvider(options).compare('simple', 'hashed');

    return expect(
      compareStub.calledWith('simple', 'hashed', undefined, { lorem: 'ipsum' }),
    ).to.be.equal(true);
  });
});
