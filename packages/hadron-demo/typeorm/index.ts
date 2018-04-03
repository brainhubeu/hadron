import { createDatabaseConnection } from '../../hadron-typeorm';
import { User } from '../entity/User';
import { Team } from '../entity/Team';

const connections = [
  createDatabaseConnection(
    'mysql',
    'mysql',
    'localhost',
    3306,
    'root',
    'my-secret-pw',
    'test',
    ['./entity/*.ts'],
    [''],
    [''],
  ),
];

export default {
  connections,
  entities: [User, Team],
};
