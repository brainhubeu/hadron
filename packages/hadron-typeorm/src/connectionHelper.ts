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

const connect = (container: IContainer, config: any): Promise<any> => {
  const {
    entities = [],
    connection = {},
  } = config;

  return createConnection(connection)
    .then((connection: Connection) => {
      container.register(CONNECTION, connection);
      return connection;
    })
    .then((connection: Connection) => {
      registerRepositories(container, connection, entities);
      return connection;
    });
}

export default connect;

