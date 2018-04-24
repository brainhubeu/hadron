## Installation

```bash
npm install @brainhubeu/hadron-security --save
```

## Overview

**_Hadron Security_** provides back-end authorization layer for routes you will choose.

### Configuration

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

To use security config you need to inject providers - User and Role provider. Here are the interfaces:
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

After injection you can use **_allow_** method:

```javascript
security
  .allow('/route', ['Role1', 'Role2'], ['get', 'post'])
  .allow('/route2', 'Role3')
  .allow('/route3/*', [['Role1', 'Role2'], 'Role3'], 'delete');
```
