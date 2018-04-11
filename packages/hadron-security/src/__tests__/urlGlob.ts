import { expect } from 'chai';
import urlGlob from '../helpers/urlGlob';

describe('Glob URL pattern', () => {
  it('should return true if url is valid', () => {
    expect(urlGlob('/api/admin/*', '/api/admin/qwe')).to.be.equal(true);
  });

  it('should return true if strict url is valid', () => {
    expect(urlGlob('/api/user/1', '/api/user/1')).to.be.equal(true);
  });

  it('should return false if url is invalid', () => {
    expect(urlGlob('/api/adm/*', '/api/admin')).to.be.equal(false);
  });

  it('should return false if strict url is invalid', () => {
    expect(urlGlob('/api/adm', '/api/admin')).to.be.equal(false);
  });
});
