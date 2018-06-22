import { IRolesMap } from './hierarchyProvider';
import IHashMethod from './password/IHashMethod';

export default interface ISecurityOptions {
  roles: IRolesMap | string[];
  hash?: {
    method: IHashMethod | string;
    options: any;
  };
};
