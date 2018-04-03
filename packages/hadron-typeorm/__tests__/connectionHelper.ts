import { expect, assert } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { connect } from '../src/connectionHelper';
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

  const containerStub = {
    register: sinon.stub(),
    take: () => null,
  };

  beforeEach(() => {
    containerStub.register.reset();
  });

  after(() => {
    createConnectionStub.restore();
    getRepositoryStub.restore();
  });

  it('should return connection', () => {
    connect(containerStub, { connection }).then((connection: any) => {
      expect(connection instanceof typeorm.Connection).to.be.eq(true);
    });
  });

  it('should register connection to container', () => {
    connect(containerStub, { connection }).then((connection: any) => {
      assert(containerStub.register.calledWith(CONNECTION));
    });
  });

  it('should register Team repository to container as teamRepository', () => {
    connect(containerStub, { connection }).then((connection: any) => {
      assert(containerStub.register.calledWith('teamRepository'));
    });
  });
});
