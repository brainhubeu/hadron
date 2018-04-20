import * as express from 'express';
import * as bodyParser from 'body-parser';
import InMemoryUserProvider from '../InMemoryUserProvider';
import InMemoryRoleProvider from '../InMemoryRoleProvider';
import HadronSecurity from '../../HadronSecurity';
import expressMiddlewareProvider, {
  generateTokenMiddleware,
} from '../../providers/expressProvider';
import securityConfig from './securityConfig';

const app = express();
app.use(bodyParser.json());

let security: HadronSecurity;

securityConfig().then((s) => {
  security = s;
});

app.post('/login', (req, res, next) => {
  if (security) {
    generateTokenMiddleware(security)(req, res, next);
  } else {
    return next();
  }
});

app.use((req, res, next) => {
  if (security) {
    expressMiddlewareProvider(security)(req, res, next);
  } else {
    return next();
  }
});

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
