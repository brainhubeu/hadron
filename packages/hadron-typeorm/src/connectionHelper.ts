import { createConnection, Connection } from 'typeorm';
import { CONNECTION } from './constants';
import { IContainer } from '../../hadron-core/src/container/types';

const repositoryName = (name: string) => `${name.toLowerCase()}Repositorys`;

const registerRepositories = (
  container: IContainer,
  connection: Connection,
  entities: any[],
) => {
  entities.forEach((entity: any) => {
    container.register(
      repositoryName(entity.name),
      connection.getRepository(entity),
    );
  });
};

const registerConnection = (container: IContainer, connection: Connection) => {
  container.register(CONNECTION, connection);
  return connection;
};

const connect = (container: IContainer, config: any): Promise<any> => {
  const { connection = {} } = config;

  return createConnection(connection)
    .then((connection) => registerConnection(container, connection))
    .then((connection: Connection) => {
      const entities =
        config.connection.entities || config.connection.entitySchemas || [];
      registerRepositories(container, connection, entities);
      return connection;
    })
    .catch((err) => {
      console.error(err);
    });
};

export { connect, registerRepositories };
