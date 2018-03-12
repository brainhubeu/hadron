const connectionBase = {
    name: "",
    type: "",
    // tslint:disable-next-line:object-literal-sort-keys
    host: "",
    port: 0,
    username: "",
    password: "",
    database: "",
    synchronize: true,
    // tslint:disable-next-line:object-literal-sort-keys
    logging: false,
    autoSchemaSync: true,
    entities: [
        "../../src/entity/**/*.ts",
    ],
    migrations: [
        "../../src/migration/**/*.ts",
    ],
    subscribers: [
        "../../src/subscriber/**/*.ts",
    ],
};

// tslint:disable-next-line:max-line-length
export function createDatabaseConnection(connectionName: string, databaseType: string, hostAdress: string, hostPort: number, username: string, userPassword: string, databaseNama: string ) {
    const newConnection = Object.assign({}, connectionBase);
    newConnection.name = connectionName;
    newConnection.type = databaseType;
// tslint:disable-next-line:object-literal-sort-keys
    newConnection.host = hostAdress;
    newConnection.port = hostPort;
    newConnection.username = username;
    newConnection.password = userPassword;
    newConnection.database = databaseNama;

    return newConnection;
}
