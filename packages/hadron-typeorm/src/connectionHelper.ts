import { createConnection, Connection, EntityOptions } from 'typeorm';
import { CONNECTION } from './constants';
import { IContainer } from '@brainhubeu/hadron-core';
import { IHadronTypeormConfig } from './types';

const repositoryName = (name: string) => `${name.toLowerCase()}Repository`;

const registerRepositories = (
  container: IContainer,
  connection: Connection,
  entities: Array<string | EntityOptions>,
) => {
  entities.forEach((entity: string | EntityOptions) => {
    const name: string = typeof entity === 'string' ? entity : entity.name;

    container.register(repositoryName(name), connection.getRepository(name));
  });
};

const registerConnection = (
  container: IContainer,
  connection: Connection,
): Connection => {
  container.register(CONNECTION, connection);
  return connection;
};

const connect = (
  container: IContainer,
  config: IHadronTypeormConfig,
): Promise<any> => {
  const { connection } = config;

  return createConnection(connection)
    .then((connection) => registerConnection(container, connection))
    .then((connection: Connection) => {
      const entitiesToRegister = [
        ...(config.connection.entities || []),
        ...(config.connection.entitySchemas || []),
      ];
      registerRepositories(container, connection, entitiesToRegister);

      return connection;
    })
    .catch((err) => {
      console.error(err);
    });
};

export { connect, registerRepositories };
