import { IRole } from './hierarchyProvider';

interface IRoleProvider {
  addRole(role: IRole): void;
  getRole(name: string): IRole;
  getRoles(): string[];
}

export default IRoleProvider;
