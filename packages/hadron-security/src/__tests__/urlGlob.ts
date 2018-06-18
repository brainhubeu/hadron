import { expect } from 'chai';
import urlGlob from '../helpers/urlGlob';

describe('Glob URL pattern', () => {
  it('should return true if URL: /api/admin/qwe is valid for PATTERN: /api/admin/*', () => {
    expect(urlGlob('/api/admin/*', '/api/admin/qwe')).to.be.equal(true);
  });

  it('should return false if URL: /api/adm/qwe is invalid for PATTERN: /api/admin/*', () => {
    expect(urlGlob('/api/admin/*', '/api/adm/qwe')).to.be.equal(false);
  });

  it('should return false if URL: /api/admin/qwe/1 is invalid for PATTERN: /api/admin/*', () => {
    expect(urlGlob('/api/admin/*', '/api/adm/qwe')).to.be.equal(false);
  });

  it('should return true if URL: /api/admin/tasks/1 is valid for PATTERN: /api/admin/**', () => {
    expect(urlGlob('/api/admin/**', '/api/admin/tasks/1')).to.be.equal(true);
  });

  it('should return true if URL: /api/something/admin/more/user/in/manager/string for PATTERN: /api/**/admin/**/manager/**', () => {
    expect(
      urlGlob(
        '/api/**/admin/**/user/**/manager/**',
        '/api/something/admin/more/user/in/manager/string',
      ),
    ).to.be.equal(true);
  });

  it('should return false if URL: /api/something/admin/more/user/in/mage/string for PATTERN: /api/**/admin/**/manager/**', () => {
    expect(
      urlGlob(
        '/api/**/admin/**/user/**/manager/**',
        '/api/something/admin/more/user/in/mage/string',
      ),
    ).to.be.equal(false);
  });

  it('should return false if URL: /api/something/admin/more is invalid for PATTERNL /api/**/user/**', () => {
    expect(urlGlob('/api/**/admin/**', '/api/something/user/more')).to.be.equal(
      false,
    );
  });

  it('should return true if URL: /api/admin is valid for strict PATTERN /api/admin', () => {
    expect(urlGlob('/api/admin', '/api/admin')).to.be.equal(true);
  });

  it('should return false if URL: /api/adm or /api.admin/1 is invalid for strict PATTERN /api/admin', () => {
    expect(urlGlob('/api/admin', '/api/adm')).to.be.equal(false);
    expect(urlGlob('/api/admin', '/api/admin/1')).to.be.equal(false);
  });
});
