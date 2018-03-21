import { expect } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { createConnection, createDatabaseConnection } from '../src/connectionHelper';

import { Team } from './mocks/entity/Team';

describe('Connection helper', () => {
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

  it('Create database connection object', () => {
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

  describe('Create connection', () => {
    const stub = sinon.stub(typeorm, 'createConnections');
    stub.onFirstCall().returns(new Promise(resolve => {
      resolve([{getRepository: () => false}])
    }));
    stub.onSecondCall().returns(new Promise(resolve => {
      resolve([conn]);
    }));

    const register = sinon.spy(containerMock, 'register');

    it('Registering teamRepository', () => {
      return createConnection(containerMock, {
        connections: [conn],
        entities: [Team],
      }).then(() => {
        sinon.assert.calledWith(register, 'teamRepository');
      });
    });

    it('Registering connections', () => {
      return createConnection(containerMock, {
        connections: [conn],
      }).then(() => {
        sinon.assert.calledWith(register, 'connections', [conn]);
      });
    });
  });
});
