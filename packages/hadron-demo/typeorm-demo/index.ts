import { createDatabaseConnection } from '@brainhubeu/hadron-typeorm';
import { User } from '../entity/User';
import { Team } from '../entity/Team';

const connection: ConnectionOptions = {
  name: 'mysql-connection',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'my-secret-pw',
  database: 'test',
  entities: [User, Team],
};

export default {
  connection,
  entities: [User, Team],
};
