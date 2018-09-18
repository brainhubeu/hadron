import { assert } from 'chai';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import { Container } from '@brainhubeu/hadron-core';

import { connect } from '../connectionHelper';
import { CONNECTION } from '../constants';

import { Team } from './mocks/entity/Team';
import { User } from './mocks/entity/User';
import { UserStatus } from './mocks/entity/UserStatus';
import userSchema from './mocks/schema/User';

const connection: typeorm.ConnectionOptions = {
  name: 'mysql-connection',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'my-secret-pw',
  database: 'test',
  entities: [Team, User, UserStatus],
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
    Container.register('connection', null);
    Container.register('teamRepository', null);
    Container.register('userRepository', null);
  });

  after(() => {
    createConnectionStub.restore();
    getRepositoryStub.restore();
  });

  it('should return connection', () =>
    connect(Container, { connection }).then((connection: any) => {
      return assert(connection instanceof typeorm.Connection);
    }));

  it('should register connection to container', () => {
    connect(Container, { connection }).then((connection: any) => {
      assert(Container.take(CONNECTION) instanceof typeorm.Connection);
    });
  });

  it('should register Team repository to container as teamRepository', () =>
    connect(Container, { connection }).then((connection: any) =>
      assert(Container.take('teamRepository')),
    ));

  it('should register UserStatus repository to container as userstatusRepository', () =>
    connect(Container, { connection }).then((connection: any) =>
      assert(Container.take('userstatusRepository')),
    ));

  it('should register User repository from javascript schema to container as userRepository', () =>
    connect(Container, {
      connection: {
        ...connection,
        entities: [],
        entitySchemas: [userSchema],
      },
    }).then((connection: any) => assert(Container.take('userRepository'))));
});
