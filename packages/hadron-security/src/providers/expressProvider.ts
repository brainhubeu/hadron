import HadronSecurity from '../HadronSecurity';
import * as express from 'express';
import * as bcrypt from '../password/bcrypt/bcrypt';
import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_TOKEN_SECRET || 'H4DR0N_S3CUR17Y';

const expressMiddlewareProvider = (security: HadronSecurity) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (security.isRouteNotSecure(req.path)) {
      return next();
    }

    try {
      if (security.isAuthByJWT()) {
        const token: any = req.headers.authorization;
        const decodedToken: any = jwt.verify(token, secret);
        const user = await security
          .getUserProvider()
          .loadUserByUsername(decodedToken.username);

        if (security.isAllowed(req.path, req.method, user)) {
          return next();
        }

        return res.status(403).json({
          message: 'Unauthenticated',
        });
      }

      const username = req.headers.authorization || req.body.username;
      const password = req.headers.password || req.body.password;
      const user = await security
        .getUserProvider()
        .loadUserByUsername(username);

      bcrypt
        .compare(password, user.passwordHash)
        .then((isAuthenticated) => {
          if (
            isAuthenticated &&
            security.isAllowed(req.path, req.method, user)
          ) {
            return next();
          }

          res.status(403).json({
            message: 'Unauthenticated',
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: 'Unauthenticated',
          });
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

      bcrypt.compare(req.body.password, user.passwordHash).then((result) => {
        if (!result) {
          return res.status(403).json({
            message: 'Unauthenticated',
          });
        }

        return res.status(200).json({
          token: jwt.sign(
            {
              username: user.username,
            },
            secret,
            { expiresIn: '1h' },
          ),
        });
      });
    } catch (error) {
      res.status(403).json({
        message: 'Unauthenticated',
      });
    }
  };
};

export default expressMiddlewareProvider;
