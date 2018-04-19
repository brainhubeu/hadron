import { ConnectionOptions } from 'typeorm';
import { User } from '../entity/User';
import { Team } from '../entity/Team';
import { Role } from '../entity/Role';

const connection: ConnectionOptions = {
  name: 'mysql-connection',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'my-secret-pw',
  database: 'test',
  entities: [User, Team, Role],
  synchronize: true,
};

export default {
  connection,
  entities: [User, Team, Role],
};
