## Installation

```bash
npm install @brainhubeu/hadron-auth --save
```

## Overview

**hadron-auth** provides back-end authorization layer for routes You will choose.

### Configuration with Hadron Core

If You want to use **hadron-auth** with **hadron-core** You should also use **hadron-typeorm** and **hadron-express**.
All You need to provide is two schemas for typeorm:

* `User` (id, username, and roles many-to-many relation required)
  Here is the example schema:

```javascript
// schemas/User
const userSchema = {
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
      unique: true,
    },
    passwordHash: {
      type: 'varchar',
    },
    addedOn: {
      type: 'timestamp',
    },
  },
  relations: {
    roles: {
      target: 'Role',
      type: 'many-to-many',
      joinTable: {
        name: 'user_role',
      },
      onDelete: 'CASCADE',
    },
  },
};

export default userSchema;
```

* `Role` (id and name required)
  Example schema:

```javascript
// schemas/Role
const roleSchema = {
  name: 'Role',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      unique: true,
    },
    addedOn: {
      type: 'timestamp',
    },
  },
};

export default roleSchema;
```

Don't forget to add schemas to Your database config, example below:

```javascript
// config/db.js
import userSchema from '../schemas/User';
import roleSchema from '../schemas/Role';

const connection = {
  name: 'mysql-connection',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'my-secret-pw',
  database: 'done-it',
  entitySchemas: [roleSchema, userSchema],
  synchronize: true,
};

export default {
  connection,
  entities: [roleSchema, userSchema],
};
```

Now You need to prepare Your hadron configuration file, where You can add secured routes, for example:

```javascript
// index.js
const config = {
  routes: {
    helloWorldRoute: {
      path: '/',
      methods: ['GET'],
      callback: () => 'Hello World',
    },
    adminRoute: {
      path: '/admin',
      methods: ['GET'],
      callback: () => 'Hello Admin',
    },
    userRoute: {
      path: '/user',
      methods: ['GET'],
      callback: () => 'Hello User',
    },
  },
  securedRoutes: [
    {
      path: '/admin/*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      roles: 'Admin',
    },
    {
      path: '/user/*',
      roles: ['Admin', 'User'],
    },
  ],
};
```

Finally You need to add **hadron-auth** to hadron initialization method:

```javascript
import hadron from '@brainhubeu/hadron-core';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronTypeOrm from '@brainhubeu/hadron-typeorm';
import * as hadronAuth from '@brainhubeu/hadron-auth';
import express from 'express';

const expressApp = express();

const hadronInit = async () => {
  const config = {
    routes: {
      helloWorldRoute: {
        path: '/',
        methods: ['GET'],
        callback: () => 'Hello World',
      },
      adminRoute: {
        path: '/admin',
        methods: ['GET'],
        callback: () => 'Hello Admin',
      },
      userRoute: {
        path: '/user',
        methods: ['GET'],
        callback: () => 'Hello User',
      },
    },
    securedRoutes: [
      {
        path: '/admin/*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        roles: 'Admin',
      },
      {
        path: '/user/*',
        roles: ['Admin', 'User'],
      },
    ],
  };

  const container = await hadron(
    expressApp,
    [hadronAuth, hadronExpress, hadronTypeOrm],
    config,
  );
};
```

---

Warning, You should pass hadronAuth as first to hadron packages array.

---

Now Your routes are secured, by default, **hadron-auth** authorize user by **JWT Token**, passed as `Authorization` header.

### Creating custom auth middleware

You can pass Your own function in hadron configuration to check if a user is authorized to the secured route.
Here is the skeleton for the authorization middleware:

```javascript
const authorizationMiddleware = (container) => {
  return (req, res, next) => {};
};
```

**hadron-auth** provides `isAllowed` function, to check if a user is allowed to specified route:

```javascript
isAllowed(path, method, user, allRoles);
```

Where:

* `path` - path to secured route, for example /api/admin/1
* `method` - HTTP method
* `user` - User object, which need to contain roles
* `allRoles` - All roles stored in database (only role names)

Here is an example authorization middleware:

```javascript
import * as jwt from 'jsonwebtoken';
import { isRouteNotSecure, isAllowed } from '@brainhubeu/hadron-auth';

const errorResponse = {
  message: 'Unauthorized',
};

const expressMiddlewareAuthorization = (container) => {
  return async (req, res, next) => {
    try {
      if (isRouteNotSecure(req.path)) {
        return next();
      }

      const userRepository = container.take('userRepository');
      const roleRepository = container.take('roleRepository');

      const token = req.headers.authorization;

      const decoded: any = jwt.decode(token);

      const user = await userRepository.findOne({
        where: { id: decoded.id },
        relations: ['roles'],
      });

      if (!user) {
        return res.status(403).json({ error: errorResponse });
      }

      const allRoles = await roleRepository.find();

      if (
        isAllowed(req.path, req.method, user, allRoles.map((role) => role.name))
      ) {
        return next();
      }

      return res.status(403).json({ error: errorResponse });
    } catch (error) {
      return res.status(403).json({ error: errorResponse });
    }
  };
};

export default expressMiddlewareAuthorization;
```

To use it, You need to pass an expressMiddlewareAuthorization function as `authorizationMiddleware` key in hadron config.

```javascript
const config = {
  authorizationMiddleware: YourCustomFunction,
};
```

### Usage:

```javascript
const securedRoutes = [
  {
    path: '/api/**',
    methods: ['GET'],
    roles: ['Admin', 'User'],
  },
  {
    path: '/api/**',
    methods: ['POST', 'PUT', 'DELETE'],
    roles: 'Admin',
  },
  {
    path: '/admin/*',
    roles: 'Admin',
  },
  {
    path: 'product/info',
    methods: ['GET'],
    roles: [['Admin', 'User'], 'Manager'],
  },
];
```

* `Path` - here we can specify the route path we want to secure, we can use a static path like `/api/admin/tasks` or by pattern:
  * `/api/admin/*` - route after `/api/admin/` is secured, for example `/api/admin/tasks` - is secured, but `/api/admin/tasks/5` - will be not secured
  * `/api/admin/**` - every route after `/api/admin` is secured
* `methods` - an array of strings, where You can pass role names, if You will not provide any role, then the route is secured and user with **ANY** role can access this if a user does not have any role he will be unauthorized.
* `roles` - here You can pass single role name, an array of role names or array of arrays of strings, which add some logic functionality, for example, if we declare:

```javascript
roles[(['Admin', 'User'], 'Manager')];
```

The user needs Admin **AND** User **OR** Manager role to access the route.
