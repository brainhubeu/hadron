import 'reflect-metadata';
import { ConnectionOptions, createConnections } from 'typeorm';
import container from '../containers/container';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { createDatabaseConnection } from '../typeorm/connectionHelper';

container.register(
    'postgresConnection',
    createDatabaseConnection('postgres', 'postgres', 'localhost', 5432, 'postgres', 'mysecretpassword', 'test'));
container.register(
    'mysqlConnection',
    createDatabaseConnection('mysql', 'mysql', 'localhost', 3306, 'root', 'my-secret-pw', 'test'));

const connectionOptions = [
  container.take('mysqlConnection') as ConnectionOptions,
  container.take('postgresConnection') as ConnectionOptions,
];

createConnections(connectionOptions)
    .then(async connections => {
      connections.map(async connection => {
        const teamRepository = connection.getRepository<Team>('team');
        const userRepository = connection.getRepository<User>('user');

        await Promise.all([
          userRepository.find().then(users => userRepository.remove(users)),
          teamRepository.find().then(teams => teamRepository.remove(teams)),
        ]);

        const team = teamRepository.create({
          name : 'team',
        });
        const savedTeam = await teamRepository.save(team);

        const firstUser = userRepository.create({
          name : 'szczepan',
          team : savedTeam,
        });
        const secondUser = userRepository.create({
          name : 'adam',
          team : savedTeam,
        });

        await Promise.all([
          userRepository.save(firstUser),
          userRepository.save(secondUser),
        ])
                .then(() => teamRepository.find({ relations : ['users'] }))
                .then(retrievedTeams => {
                  retrievedTeams.forEach(retrievedTeam =>
                    // tslint:disable-next-line:no-console
                    console.log(retrievedTeam));
                });
      });
    })
    .catch(err => {
      // tslint:disable-next-line:no-console
      console.log('Cannot connect to database', err);
    });
