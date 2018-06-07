import * as jwt from 'jsonwebtoken';
import { isRouteNotSecure, isAllowed } from '../HadronAuth';

const errorResponse = {
  message: 'Unauthorized',
};

const expressMiddlewareAuthorization = (container: any) => {
  return async (req: any, res: any, next: any) => {
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
        // @ts-ignore
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
