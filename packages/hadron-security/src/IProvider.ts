import { IUser } from './hierarchyProvider';

interface IProvider {
  addRole(name: string): void;
  removeRole(name: string): void;
  getRoles(): string[];
  hasRole(user: IUser): boolean;
  addUserRole(username: string, role: string): void;
  allow(routes: string[], roles: string[]): void;
  middleware(): void;
  isAllowed(routes: string[], user: IUser): boolean;
}
