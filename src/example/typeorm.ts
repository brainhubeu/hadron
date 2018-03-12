import { Then } from "cucumber";
import "reflect-metadata";
// tslint:disable-next-line:max-line-length
import { Connection, ConnectionOptions, createConnection, createConnections, getConnection } from "typeorm";
import { promisify } from "util";
import container from "../containers/container";
import { Team } from "../entity/Team";
import { User } from "../entity/User";
import { createDatabaseConnection } from "../typeorm/connectionHelper";

container.register(
    "postgresConnection",
    createDatabaseConnection("postgres", "postgres", "localhost", 5432, "postgres", "mysecretpassword", "test"));
container.register(
    "mysqlConnection",
    createDatabaseConnection("mysql", "mysql", "localhost", 3306, "root", "my-secret-pw", "test"));

const connectionOptions = [
    container.take("mysqlConnection") as ConnectionOptions,
    container.take("postgresConnection") as ConnectionOptions,
];

createConnections(connectionOptions)
    .then(async (connections) => {
        connections.map(async (connection) => {
            const teamRepository = connection.getRepository<Team>("team");
            const userRepository = connection.getRepository<User>("user");

            await Promise.all([
                userRepository.find().then((users) => userRepository.remove(users)),
                teamRepository.find().then((teams) => teamRepository.remove(teams)),
            ]);

            const team = teamRepository.create();
            team.name = "team" + Math.random();

            const t = await teamRepository.save(team);

            const user = userRepository.create();
            user.name = "szczepan" + Math.random();
            user.team = t;

            const newUser = userRepository.create();
            newUser.name = "adam";
            newUser.team = t;

            await Promise.all([
                    userRepository.save(user),
                    userRepository.save(newUser),
                ])
                .then(() => teamRepository.find({relations : ["users"]}))
                .then((teams) => {
                    teams.map((tt) => console.log(tt));
                });
            });
        });
