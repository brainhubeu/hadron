import * as express from 'express';
import * as bodyParser from 'body-parser';
import InMemoryUserProvider from '../InMemoryUserProvider';
import InMemoryRoleProvider from '../InMemoryRoleProvider';
import HadronSecurity from '../../HadronSecurity';

const userProvider = new InMemoryUserProvider();
const roleProvider = new InMemoryRoleProvider();

roleProvider.addRole({ id: 1, name: 'Admin' });
roleProvider.addRole({ id: 2, name: 'User' });
roleProvider.addRole({ id: 3, name: 'Manager' });

const roleHierarchy = {
  ADMIN: ['Admin'],
  USER: ['User'],
  ALL: ['Admin', 'User'],
};

userProvider.addUser({
  id: 1,
  username: 'admin',
  password: 'admin',
  roles: [roleProvider.getRole('Admin')],
});

userProvider.addUser({
  id: 2,
  username: 'user',
  password: 'user',
  roles: [roleProvider.getRole('User')],
});

userProvider.addUser({
  id: 3,
  username: 'uberAdmin',
  password: 'qwe',
  roles: [roleProvider.getRole('Admin'), roleProvider.getRole('User')],
});

userProvider.addUser({
  id: 4,
  username: 'manager',
  password: 'manager',
  roles: [roleProvider.getRole('Manager')],
});

const security = new HadronSecurity(userProvider, roleProvider, roleHierarchy);

security
  .allow('/user', 'User', ['post'])
  .allow('/admin/*', ['Admin'], ['post'])
  .allow('/adm', [['User', 'Admin'], 'Manager'], ['post'])
  .allow('/all', ['Admin', 'User'], ['post'])
  .allow('/qwe', ['NotExists', 'Admin', 'Guest', 'Manager'])
  .allow('/zxc', ['Guest', 'Owner', 'User']);

const app = express();
app.use(bodyParser.json());

app.use(security.expressMiddleware);

app.use(bodyParser.json());

app.post(
  '/user',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'This message can be only seen by user.',
    });
  },
);

app.post(
  '/admin',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'This message can be only seen by admin.',
    });
  },
);

app.post(
  '/adm',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message:
        'This message can be only seen by uberAdmin with roles: [User, Admin] or Manager.',
    });
  },
);

app.post(
  '/admin/qwe',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'This message (qwe) can be only seen by admin.',
    });
  },
);

app.post(
  '/all',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'This message is visible for all roles.',
    });
  },
);

app.get(
  '/noauth',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'This message is visible without authentication.',
    });
  },
);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      message: 'Hello World',
    });
  },
);

export default app;
