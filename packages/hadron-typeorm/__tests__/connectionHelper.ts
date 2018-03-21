import { expect } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { createConnection, createDatabaseConnection } from '../src/connectionHelper';

import { Team } from './mocks/entity/Team';

describe('typeORM', () => {
  let items: any = {};
  const conn = createDatabaseConnection(
    'connName', 'MySQL', 'hostAddr',
    8080, 'userName', 'password',
    'dbName',
  );
  const containerMock = {
    register: (key: string, value: any) => {
      items[key] = value;
    },
    take: (key: string) => items[key],
  }

  before(() => {
    items = {};
  });

  it('should return ConnectionOption object with valid values', () => {
    expect(conn).to.deep.equal({
      ...conn,
      name: 'connName',
      type: 'MySQL',
      host: 'hostAddr',
      port: 8080,
      username: 'userName',
      password: 'password',
      database: 'dbName',
    });
  });

  const stub = sinon.stub(typeorm, 'createConnections');
  stub.onFirstCall().returns(new Promise(resolve => {
    resolve([{getRepository: () => false}])
  }));
  stub.onSecondCall().returns(new Promise(resolve => {
    resolve([conn]);
  }));

  const register = sinon.spy(containerMock, 'register');

  it('should register repository to container with key "teamRepository"', () => {
    return createConnection(containerMock, {
      connections: [conn],
      entities: [Team],
    }).then(() => {
      sinon.assert.calledWith(register, 'teamRepository');
    });
  });

  it('should register connection array to container', () => {
    return createConnection(containerMock, {
      connections: [conn],
    }).then(() => {
      sinon.assert.calledWith(register, 'connections', [conn]);
    });
  });
});
