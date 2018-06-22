import { IUser, IRole } from './src/hierarchyProvider';
import * as bcrypt from './src/password/bcrypt/bcrypt';
import * as HadronAuth from './src/HadronAuth';

export const register = (container: any, config: any) => {
  HadronAuth.register(container, config);
};

export default HadronAuth;
export { IUser, IRole, bcrypt };
