import { Container } from '@brainhubeu/hadron-core';
import createContainerProxy from '../createContainerProxy';
import * as sinon from 'sinon';
import { expect } from 'chai';

describe('proxy container', () => {
  it('calls keys() method on the container ', () => {
    const keys = sinon.spy(Container, 'keys');
    const containerProxy = createContainerProxy(Container);
    containerProxy.keys();
    expect(keys.calledOnce).to.be.equal(true);
  });

  it('calls take() method on the container', () => {
    Container.register('key', 'item');
    const take = sinon.spy(Container, 'take');
    const containerProxy = createContainerProxy(Container);
    // tslint:disable-next-line
    containerProxy.key;
    expect(take.calledOnce).to.be.equal(true);
  });
});
