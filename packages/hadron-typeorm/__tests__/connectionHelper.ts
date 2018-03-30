import { expect } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { connect } from '../src/connectionHelper';
import containerMock, { clear as clearContainer } from './mocks/container';
import { CONNECTION } from '../src/constants';

import { Team } from './mocks/entity/Team';
import { User } from './mocks/entity/User';

const connection: typeorm.ConnectionOptions = {
  name: 'mysql-connection',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'my-secret-pw',
  database: 'test',
  entities: [Team, User],
};

describe('TypeORM connection helper', () => {
  const createConnectionStub = sinon.stub(typeorm, 'createConnection');
  createConnectionStub.returns(
    new Promise((resolve) => {
      resolve(new typeorm.Connection(connection));
    }),
  );
  const getRepositoryStub = sinon.stub(
    typeorm.Connection.prototype,
    'getRepository',
  );
  getRepositoryStub.returns(true);

  beforeEach(() => {
    clearContainer();
  });
  after(() => {
    createConnectionStub.restore();
    getRepositoryStub.restore();
  });

  it('should return connection', () => {
    connect(containerMock, { connection }).then((connection: any) => {
      expect(connection instanceof typeorm.Connection).to.be.eq(true);
    });
  });

  it('should register connection to container', () => {
    connect(containerMock, { connection }).then((connection: any) => {
      expect(
        containerMock.take(CONNECTION) instanceof typeorm.Connection,
      ).to.be.eq(true);
    });
  });

  it('should register Team repository to container as teamRepository', () => {
    connect(containerMock, { connection }).then((connection: any) => {
      expect(containerMock.take('teamRepository')).to.be.eq(true);
    });
  });
});
