## Installation

```bash
npm install @brainhubeu/hadron-authorization --save
```

## Overview

**hadron-authorization** provides back-end authorization layer for routes you will choose.

### Configuration with Hadron Core

If you want to use **hadron-auth** with **hadron-core** you should also use **hadron-typeorm** and **hadron-express**.
All you need to provide is two schemas for typeorm:

* `User` (id, username and roles many-to-many relation)
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

* `Role` (id and name)
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

Don't forget to add schemas to your database config, example below:

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

`Of course you can add additional properties if you want.`

Now you need to prepare your hadron configuration file, where you can add secured routes, for example:

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

Finally you need to add **hadron-authorization** to hadron initialization method:

```javascript
import hadron from '@brainhubeu/hadron-core';
import * as hadronExpress from '@brainhubeu/hadron-express';
import * as hadronTypeOrm from '@brainhubeu/hadron-typeorm';
import * as hadronAuth from '@brainhubeu/hadron-authorization';
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

Warning, you should pass hadronAuth as first to hadron packages array.

---

Now your routes are secured, by default, **hadron-auth** authorize user by JWT Token, passed as `Authorization` header.

### Creating custom authorization middleware

You can pass your own function in hadron configuration to check if user is authorized to secured route.
Here is the skeleton for the authorization middleware:

```javascript
const authorizationMiddleware = (container) => {
  return (req, res, next) => {};
};
```

**hadron-auth** provides `isAllowed` function, to check if user is allowed to specified route:

```javascript
isAllowed(path, method, user, allRoles);
```

Where:

* `path` - path to secured route, for example /api/admin/1
* `method` - HTTP method
* `user` - User object, which need to contain roles
* `allRoles` - All roles stored in database (only names)

Here is an example authorization middleware:

```javascript
import * as jwt from 'jsonwebtoken';
import { isRouteNotSecure, isAllowed } from '@brainhubeu/hadron-authorization';

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

To use it, you need to pass expressMiddlewareAuthorization function as `authorizationMiddleware` key in hadron config.

```javascript
const config = {
  authorizationMiddleware: yourCustomFunction,
};
```

### Using hadron-authorization without hadron-core
