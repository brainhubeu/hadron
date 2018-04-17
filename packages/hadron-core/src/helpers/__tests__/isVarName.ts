import { assert } from 'chai';
import isVarName from '../isVarName';

describe('isVarName', () => {
  it('when provided "variable" should return true', () => {
    assert(isVarName('variable'));
  });
  it('when provided "someLongVariableNameMayBeCorrect" should return true', () => {
    assert(isVarName('someLongVariableNameMayBeCorrect'));
  });
  it('when provided "delete" should return true', () => {
    assert(isVarName('delete'));
  });
  it('when provided "var" should return true', () => {
    assert(isVarName('var'));
  });
  it('when provided "do" should return true', () => {
    assert(isVarName('do'));
  });
  it('when provided "1" should return false', () => {
    assert(!isVarName('1'));
  });
  it('when provided "1variable" should return false', () => {
    assert(!isVarName('1variable'));
  });
  it('when provided "-v" should return false', () => {
    assert(!isVarName('-v'));
  });
  it('when provided "variable-name" should return false', () => {
    assert(!isVarName('variable-name'));
  });
  it('when provided "variable name" should return false', () => {
    assert(!isVarName('variable name'));
  });
});
