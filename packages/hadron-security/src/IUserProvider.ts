import { IUser } from './hierarchyProvider';

interface IUserProvider {
  addUser(user: IUser): void;
  loadUserByUsername(username: string): Promise<IUser>;
  refreshUser(user: IUser): void;
}

export default IUserProvider;
