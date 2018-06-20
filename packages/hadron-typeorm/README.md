## Installation

```bash
npm install @brainhubeu/hadron-typeorm --save
```

[More info about installation](/core/#installation)

## Initializing

Pass package as an argument for hadron bootstrapping function:

```javascript
const hadronTypeOrm = require('@brainhubeu/hadron-typeorm');
// ... importing and initializing other components

hadron(expressApp, [hadronTypeOrm], config).then(() => {
  console.log('Hadron with typeORM initialized');
});
```

## Connecting to database

You can set up a new connection using [connection object](http://typeorm.io/#/connection).

```javascript
{
  connectionName: string,
  type: string,
  host: string,
  port: number,
  username: string,
  password: string,
  database: string
  entitySchemas: entities,
  synchronize: bool,
}
```

* `connectionName` - string that identifies this connection
* `type` - string that defines type of database, f.e. mysql, mariadb, postgres, sqlite, mongodb,
* `host` - url to database,
* `port` - port of database,
* `username` - username of account to databse,
* `password` - password to database,
* `database` - name of database
* `entities` - array of classes that defines models
* `entitySchemas` - in case that You are describing models with schemas, put those in this parameter
* `synchronize` - parameter that defines if database should be automatically synchronized with models

Also all other parameters available in typeOrm are available. Please take a look at [TypeORM documentation](https://github.com/typeorm/typeorm#creating-a-connection-to-the-database)

## Including database connection in hadron

_NOTE: Also events aren't included in this section so logging into the console is done using setTimeout._

Since we have our connection, we need to include it inside our hadron constructor's config object.

```javascript
const hadronTypeOrm = require('@brainhubeu/hadron-typeorm');

const config = {
  connection: {
    /* connection object */
  },
};

hadron(expressApp, [hadronTypeOrm], config).then((container) => {
  console.log('Initialized connection:', container.take('connection'));
});
```

## Entities

Let's assume we want to have a simple table **user**

| Field     | Type    |
| --------- | ------- |
| 🔑 id     | int     |
| firstName | varchar |
| lastName  | varchar |

We have two options while defining our `entities`.

### Class + Decorators

```typescript
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  @Column()
  id: number;

  @Column() firstName: string;

  @Column() lastName: string;
}
```

When using this method, while creating connection to database, those classes should be in `entities` parameter.

### Schema Way

```javascript
// entity/User.js

module.exports = {
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    firstName: {
      type: 'varchar',
    },
    lastName: {
      type: 'varchar',
    },
  },
};
```

When using this method, while creating connection to database, those schemas should be in `entitySchemas` parameter.

For more details about defining models, please take a look at [TypeORM documentation](http://typeorm.io/#/entities). Especially section about [available types](http://typeorm.io/#/entities/column-types) for each database distribution

## Injecting entities into hadron

To include our entities in hadron, we simply need to include them in our config object.
Let's modify the code that we were using to initialize hadron:

```javascript
const hadronTypeOrm = require('@brainhubeu/hadron-typeorm');
const user = require('./entity/User');

const config = {
  connection,
  entities: [user],
};

hadron(expressApp, [hadronTypeOrm], config).then((container) => {
  console.log(
    'userRepository available:',
    container.take('userRepository') !== null,
  );
  // User entity should be declared under userRepository key and
  // will be available as a typeORM repository
});
```

Repository key in Container depends from name of schema/class and is builded in such way:
`<schema/class name in camelCase>Repository`

Examples:

```
User = userRepository
SuperUser = superUserRepository
loremIpsumDolor = loremIpsumDolorRepository
```

## Repositories

Generater repositories contain same methods as ones from TypeORM. Please check them out here:

[http://typeorm.io/#/working-with-entity-manager](http://typeorm.io/#/working-with-entity-manager)

## Troubleshooting

### I can' connect to database:

* make sure that connection config has valid data and there is existing database with specified name

### There are no tables in my database

* There are few possible reasons for that. Firstly check if parameter `synchronize` in configuration is set to true.

* Then make sure that connection configuration contains `entities`/`entitySchemas` fields.

* Remember, if You are using class definition of models, You need to put them in `entities` parameter, otherwise (schema method) in `entitySchemas`

### There is an information that I am missing a driver

* If you decided which database You want to use, You need to add a proper driver to your dependencies. For more details check TypeORM [README](https://github.com/typeorm/typeorm#installation) file
