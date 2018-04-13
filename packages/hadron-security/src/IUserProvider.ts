import { IUser } from './hierarchyProvider';

interface IUserProvider {
  addUser(user: IUser): void;
  loadUserByUsername(username: string): IUser;
  refreshUser(user: IUser): void;
}

export default IUserProvider;
