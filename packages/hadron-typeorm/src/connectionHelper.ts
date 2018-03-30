import { createConnection, Connection } from 'typeorm';
import { CONNECTION, REPOSITORY_NAME_FACTORY } from './constants';
import { IContainer } from '../../hadron-core/src/container/types';


const registerRepositories = (container: IContainer, connection: Connection, entities: any[]) => {
  // Register repositories inside container
  entities.forEach((entity: any) => {
    container.register(
      REPOSITORY_NAME_FACTORY(entity.name),
      connection.getRepository(entity),
    );
  });
}

const registerConnection = (container: IContainer, connection: Connection) => {
  container.register(CONNECTION, connection);
  return connection;
};

const connect = (container: IContainer, config: any): Promise<any> => {
  const {
    connection = {},
  } = config;

  return createConnection(connection)
    .then(connection => registerConnection(container, connection))
    .then((connection: Connection) => {
      registerRepositories(container, connection, config.connection.entities || []);
      return connection;
    });
}

export {
  connect,
  registerRepositories,
}
