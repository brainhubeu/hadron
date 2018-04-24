import { IRole } from './hierarchyProvider';

interface IRoleProvider {
  getRole(name: string): Promise<IRole>;
  getRoles(): Promise<string[]>;
}

export default IRoleProvider;
