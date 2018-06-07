import * as jwt from 'jsonwebtoken';
import { isRouteNotSecure, isAllowed } from '../HadronAuth';

const error = {
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
        return res.status(403).json({ error });
      }

      const allRoles = await roleRepository.find();

      // @ts-ignore
      if (
        isAllowed(req.path, req.method, user, allRoles.map((role) => role.name))
      ) {
        return next();
      }

      return res.status(403).json({ error });
    } catch (error) {
      return res.status(403).json({ error });
    }
  };
};

export default expressMiddlewareAuthorization;
