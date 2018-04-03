import { expect } from 'chai';
import toCamelCase from '../toCamelCase';

describe('toCamelCase helper function', () => {
  it('when provided fooBar should return fooBar', () => {
    expect(toCamelCase('fooBar')).to.be.equal('fooBar');
  })
  it('when provided foo-bar should return fooBar', () => {
    expect(toCamelCase('foo-bar')).to.be.equal('fooBar');
  });
  it('when provided foo bar should return fooBar', () => {
    expect(toCamelCase('foo bar')).to.be.equal('fooBar');
  });
  it('when provided Lorem ipsum-dolor should return loremIpsumDolor', () => {
    expect(toCamelCase('Lorem ipsum-dolor')).to.be.equal('loremIpsumDolor');
  });
  it('when provided foo bar should return fooBar', () => {
    expect(toCamelCase('foo bar')).to.be.equal('fooBar');
  });
});