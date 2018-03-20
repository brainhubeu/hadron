import { expect } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { createConnection, createDatabaseConnection } from '../src/connectionHelper';

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
    stub.returns(new Promise((resolve, reject) => {
      resolve([conn]);
    }))

    const register = sinon.spy(containerMock, 'register');

    it('Registering repositories', () => {
      return createConnection(containerMock, {
        connections: [conn],
      }).then(() => {
        sinon.assert.calledWith(register, 'repositories');
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
