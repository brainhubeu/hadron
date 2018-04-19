import HadronSecurity from '../HadronSecurity';
import * as express from 'express';

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
      if (
        security.isAllowed(
          req.path,
          req.method,
          await security
            .getUserProvider()
            .loadUserByUsername(req.headers.authorization || req.body.username),
        )
      ) {
        return next();
      }
      res.status(401).json({
        message: 'Unauthorized',
      });
    } catch (error) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  };
};

export default expressMiddlewareProvider;
