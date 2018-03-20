
import { createConnection, createDatabaseConnection } from './src/connectionHelper';

export default createDatabaseConnection;

export const register = (container: any, config: any) => {
  console.log('registering typeorm');

  createConnection(container, config);
};

export { createDatabaseConnection };
