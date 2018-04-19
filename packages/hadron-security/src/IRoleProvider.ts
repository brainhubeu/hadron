import { IRole } from './hierarchyProvider';

interface IRoleProvider {
  addRole(role: IRole): void;
  getRole(name: string): Promise<IRole>;
  getRoles(): Promise<string[]>;
}

export default IRoleProvider;
