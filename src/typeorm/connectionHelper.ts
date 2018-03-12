class ConnectionOption {
    public name: string;
    public type: string;
    // tslint:disable-next-line:object-literal-sort-keys
    public host: string;
    public port: number;
    public username: string;
    public password: string;
    public database: string;
    public synchronize: boolean;
    // tslint:disable-next-line:object-literal-sort-keys
    public logging: boolean = false;
    public autoSchemaSync: boolean = true;
    public entities: string[] = [ "../../src/entity/**/*.ts" ];
    public migrations: string[] = [ "../../src/migration/**/*.ts" ];
    public subscribers: string[] = [ "../../src/subscriber/**/*.ts" ];
}

// tslint:disable-next-line:max-line-length
const createDatabaseConnection = (connectionName: string, databaseType: string, hostAdress: string, hostPort: number, username: string, userPassword: string, databaseNama: string ): ConnectionOption => {
    const newConnection = new ConnectionOption();
    newConnection.name = connectionName;
    newConnection.type = databaseType;
// tslint:disable-next-line:object-literal-sort-keys
    newConnection.host = hostAdress;
    newConnection.port = hostPort;
    newConnection.username = username;
    newConnection.password = userPassword;
    newConnection.database = databaseNama;

    return newConnection;
};

export { createDatabaseConnection };
