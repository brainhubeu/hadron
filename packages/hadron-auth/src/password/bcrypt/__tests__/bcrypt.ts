import { hash, compare } from '../bcrypt';
import * as bcrypt from 'bcrypt';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('bcrypt', () => {
  describe('hash', () => {
    let hashStub: any = null;
    let genSaltStub: any = null;

    before(() => {
      hashStub = sinon.stub(bcrypt, 'hash');
      genSaltStub = sinon.stub(bcrypt, 'genSalt');
    });

    beforeEach(() => {
      hashStub.reset();
      genSaltStub.reset();
      hashStub.returns(Promise.resolve('h45h'));
      genSaltStub.returns(Promise.resolve('54lt'));
    });

    after(() => {
      hashStub.restore();
      genSaltStub.restore();
    });

    it('should run bcrypt hash method, if salt given', () => {
      const password = 'loremIpsum';
      const salt = 'd0n7-b3-s0-s4l7y';
      return hash(password, salt).then(() =>
        expect(hashStub.calledWithExactly(password, salt)).to.be.equal(true),
      );
    });

    it('should generate salt if none given', () => {
      const password = 'loremIpsum';
      return hash(password, null).then(() =>
        expect(hashStub.calledWithExactly(password, '54lt')).to.be.equal(true),
      );
    });

    it('should run genSalt method of bcrypt, if no salt was passed', () => {
      const password = 'loremIpsum';
      return hash(password, null).then(() =>
        expect(genSaltStub.calledWith()).to.be.equal(true),
      );
    });

    it('should run genSalt method of bcrypt, if no salt was passed, with saltRound property from options', () => {
      const password = 'loremIpsum';
      const options = {
        saltRounds: 12,
      };
      return hash(password, null, options).then(() =>
        expect(genSaltStub.calledWithExactly(12)).to.be.equal(true),
      );
    });
  });

  describe('compare', () => {
    let compareStub: any = null;

    before(() => {
      compareStub = sinon.stub(bcrypt, 'compare');
    });

    beforeEach(() => {
      compareStub.reset();
      compareStub.returns(Promise.resolve(true));
    });

    after(() => {
      compareStub.restore();
    });

    it('should run compare method', () =>
      compare('loremIpsum', 'loremIpsum1').then(() =>
        expect(
          compareStub.calledWithExactly('loremIpsum', 'loremIpsum1'),
        ).to.be.equal(true),
      ));

    it('should resolves with true if passwords are matching', () =>
      expect(compare('loremIpsum', 'loremIpsum1')).to.be.eventually.equal(
        true,
      ));

    it('should resolves with false if passwords are not matching', () => {
      compareStub.returns(Promise.resolve(false));
      return expect(
        compare('loremIpsum', 'loremIpsum1'),
      ).to.be.eventually.equal(false);
    });
  });
});
