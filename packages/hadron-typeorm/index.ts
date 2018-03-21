
import { createConnection, createDatabaseConnection } from './src/connectionHelper';
import * as constants from './src/constants';

export default createDatabaseConnection;

export const register = (container: any, config: any): Promise<void> => {
  console.log('registering typeorm');

  return createConnection(container, config);
};

export { createDatabaseConnection, constants };
