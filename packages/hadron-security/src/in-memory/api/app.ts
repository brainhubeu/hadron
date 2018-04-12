import * as express from 'express';
import * as bodyParser from 'body-parser';
import InMemoryUserProvider from '../InMemoryUserProvider';
import InMemoryRoleProvider from '../InMemoryRoleProvider';
import HadronSecurity from '../../HadronSecurity';

const userProvider = new InMemoryUserProvider();
const roleProvider = new InMemoryRoleProvider();

roleProvider.addRole({ id: 1, name: 'Admin' });
roleProvider.addRole({ id: 2, name: 'User' });

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

const security = new HadronSecurity(userProvider);

security
  .allow('/user', [roleProvider.getRole('User')])
  .allow('/admin/*', [roleProvider.getRole('Admin')])
  .allow('/adm', [roleProvider.getRole('User')])
  .allow('/all', [roleProvider.getRole('Admin'), roleProvider.getRole('User')]);

const app = express();
app.use(bodyParser.json());

app.use(security.middleware);

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
