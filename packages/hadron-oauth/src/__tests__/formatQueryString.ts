import { expect } from 'chai';

import formatQueryString from '../util/formatQueryString';

describe('utils', function() {
  it('formatQueryString should format an object into a correct url query string', function() {
    const obj = { a: 5, b: 'potato' };

    const query = formatQueryString(obj);

    expect(query).to.be.equal('a=5&b=potato&');
  });
});
