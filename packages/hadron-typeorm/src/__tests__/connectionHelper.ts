import { assert } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { connect } from '../connectionHelper';
import { CONNECTION } from '../constants';

import { Team } from './mocks/entity/Team';
import { User } from './mocks/entity/User';
import userSchema from './mocks/schema/User';

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

  it('should return connection', () =>
    connect(containerStub, { connection }).then((connection: any) =>
      assert(connection instanceof typeorm.Connection),
    ));

  it('should register connection to container', () => {
    connect(containerStub, { connection }).then((connection: any) => {
      assert(containerStub.register.calledWith(CONNECTION));
    });
  });

  it('should register Team repository to container as teamRepository', () =>
    connect(containerStub, { connection }).then((connection: any) =>
      assert(containerStub.register.calledWith('teamRepository')),
    ));

  it('should register User repository from javascript schema to container as userRepository', () =>
    connect(containerStub, {
      connection: {
        ...connection,
        entities: [],
        entitySchemas: [userSchema],
      },
    }).then((connection: any) =>
      assert(containerStub.register.calledWith('userRepository')),
    ));
});
