import HadronSecurity from './src/HadronSecurity';
import IUserProvider from './src/IUserProvider';
import IRoleProvider from './src/IRoleProvider';
import { IUser, IRole } from './src/hierarchyProvider';
import InMemoryRoleProvider from './src/in-memory/InMemoryRoleProvider';
import InMemoryUserProvider from './src/in-memory/InMemoryUserProvider';
import expressMiddlewareProvider, {
  generateTokenMiddleware,
} from './src/providers/expressProvider';
import * as bcrypt from './src/password/bcrypt/bcrypt';

export const register = (container: any, config: any) => {
  // console.log('Lorem Ipsum');
};

export default HadronSecurity;
export {
  IUserProvider,
  IRoleProvider,
  IUser,
  IRole,
  InMemoryRoleProvider,
  InMemoryUserProvider,
  expressMiddlewareProvider,
  generateTokenMiddleware,
  bcrypt,
};
