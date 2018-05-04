## Installation

```bash
npm install @brainhubeu/hadron-security --save
```

## Overview

**_Hadron Security_** provides back-end authorization layer for routes you will choose.

### Configuration

To use security config you need to build User and Role provider. Here are the interfaces:  
**_IRole_** and **_IUser_**

```typescript
interface IRole {
  id: number | string;
  name: string;
}

interface IUser {
  id: number | string;
  username: string;
  passwordHash: string;
  roles: IRole[];
}
```

**_IUserProvider_**

```typescript
interface IUserProvider {
  loadUserByUsername(username: string): Promise<IUser>;
  refreshUser(user: IUser): void;
}
```

**_IRoleProvider_**

```typescript
interface IRoleProvider {
  getRole(name: string): Promise<IRole>;
  getRoles(): Promise<string[]>;
}
```

After that you can inject providers to HadronSecurity instance:

```javascript
const security = new HadronSecurity(userProvider, roleProvider);
```

When your security is ready you can use **_allow_** method:

```javascript
allow(route, roles, methods);
```

* `route` - a string which contains URL which will be secured.
* `roles` - an optional string or array of strings or array of array of strings which contains role names allowed by security.
* `methods` - an optional array of strings, which contains HTTP methods allowed by security, default all methods are allowed.

If you will not provide any roles or set string `'*'`, then a user with **any** role can access this route, user with 0 roles still not have access to this route.

**_allow_** method, supports role hierarchy, for example you can use:

```javascript
allow('/route', [['Admin', 'User'], 'Manager']);
```

Where user which wants access to `/route` must have Admin **AND** User **OR** Manager role.

#### Example

```javascript
security
  .allow('/route', ['Role1', 'Role2'], ['get', 'post'])
  .allow('/route2', 'Role3')
  .allow('/route3/*', [['Role1', 'Role2'], 'Role3'], 'delete');
```

Next, you can use security instance returned from promise to check if the user is allowed to route by:

```javascript
isAllowed(path, allowedMethod, user);
```

* `path` - a string which contains URL.
* `allowedMethod` - string which contains HTTP method.
* `user` - IUser implementation.

## Configuration example

```javascript
const securityConfig = (
  userProvider: IUserProvider,
  roleProvider: IRoleProvider,
): Promise<HadronSecurity> => {
  return new Promise((resolve, reject) => {
    roleProvider.getRoles().then((roles) => {
      const security = new HadronSecurity(userProvider, roleProvider);

      security
        .allow('/team/*', [['Admin', 'User'], 'Manager'])
        .allow(
          '/user/*',
          ['NotExists', 'ThisDoesNotExistsToo', 'User', 'Admin'],
          ['get'],
        )
        .allow('/user/*', 'Admin', ['post', 'put', 'delete'])
        .allow('/qwe', ['DoesNotExists']);

      resolve(security);
    });
  });
};
```

By default all routes are unsecured, you can change by calling a method: **_secureAllRoutes_** from **HadronSecurity**:

```javascript
security.secureAllRoutes().allow('/team/*', [['Admin', 'User'], 'Manager']);
```

## Express support

If you are using **_express_**, you can use middleware provider from hadron-security:

```javascript
expressApp.use(expressMiddlewareProvider(security));
```

Where expressApp is an instance of express() and security is an instance of HadronSecurity class.

---

### Warning

**_expressMiddlewareProvider_** should be the first route in your express app.

---

**hadron-security** also provides **JWT** token generator middleware, you just need to provide HadronSecurity instance:

```javascript
expressApp.post('/login', generateTokenMiddleware(security));
```

By default **_expressMiddlewareProvider_** authenticate a user by **JWT** token, but if you want to authorize the user by username and password you can set this by the end of your security config:

```javascript
security
  .allow('/route/*', 'Admin')
  .allow('/route2/', 'User', ['get'])
  .authenticateByUsernameAndPassword();
```

You can provide credentials by request headers:

* `Authorization` - username
* `Password` - password

Or by request body:

```json
{
  "username": "user",
  "password": "user"
}
```
