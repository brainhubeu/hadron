import HadronSecurity from '../HadronSecurity';
import * as express from 'express';
import * as bcrypt from '../password/bcrypt/bcrypt';
import * as jwt from 'jsonwebtoken';

const expressMiddlewareProvider = (security: HadronSecurity) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (security.getRouteFromPath(req.path) === null) {
      return next();
    }

    try {
      const token: any = req.headers.authorization;
      const decodedToken: any = jwt.verify(
        token,
        'VerySecretHadronPasswordWow',
      );
      const user = await security
        .getUserProvider()
        .loadUserByUsername(decodedToken.username);

      if (security.isAllowed(req.path, req.method, user)) {
        return next();
      }
      res.status(403).json({
        message: 'Unauthenticated',
      });
    } catch (error) {
      res.status(403).json({
        message: 'Unauthenticated',
      });
    }
  };
};

export const generateTokenMiddleware = (security: HadronSecurity) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const user = await security
        .getUserProvider()
        .loadUserByUsername(req.body.username);

      if (!bcrypt.compare(req.body.password, user.passwordHash)) {
        return res.status(403).json({
          message: 'Unauthenticated',
        });
      }

      return res.status(200).json({
        token: jwt.sign(
          {
            username: user.username,
          },
          'VerySecretHadronPasswordWow',
          { expiresIn: '1h' },
        ),
      });
    } catch (error) {
      res.status(403).json({
        message: 'Unauthenticated',
      });
    }
  };
};

export default expressMiddlewareProvider;
