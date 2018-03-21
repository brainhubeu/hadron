import { ConnectionOptions, createConnections, getRepository } from 'typeorm';
import { CONNECTIONS, REPOSITORY_NAMES } from './constants';

class ConnectionOption {
  public name: string;
  public type: string;
  public host: string;
  public port: number;
  public username: string;
  public password: string;
  public database: string;
  public synchronize: boolean;
  public logging: boolean = false;
  public autoSchemaSync: boolean = true;
  public entities: string[] = ['../../src/entity/**/*.ts'];
  public migrations: string[] = ['../../src/migration/**/*.ts'];
  public subscribers: string[] = ['../../src/subscriber/**/*.ts'];
}

const createDatabaseConnection = (connectionName: string, databaseType: string, hostAdress: string, hostPort: number,
                                  username: string, userPassword: string, databaseNama: string): ConnectionOption => {
  const newConnection = new ConnectionOption();
  newConnection.name = connectionName;
  newConnection.type = databaseType;
  newConnection.host = hostAdress;
  newConnection.port = hostPort;
  newConnection.username = username;
  newConnection.password = userPassword;
  newConnection.database = databaseNama;

  return newConnection;
};

const createConnection = (container: any, config: any) => {
  const {
    connections: connectionArray = [],
    entities: entityArray = [],
    log = false,
  } = config;

  return createConnections(connectionArray)
  .then(async connections => {
    // Register repositories inside container
    entityArray.forEach((entity: any) => {
      container.register(REPOSITORY_NAMES(entity.name), connections[0].getRepository(entity));
    });

    // Register connections inside container
    container.register(CONNECTIONS, connections);
  });
}

export { createConnection, createDatabaseConnection, ConnectionOption };
