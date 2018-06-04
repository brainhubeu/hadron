import { IUser } from './hierarchyProvider';

interface IUserProvider {
  loadUserByUsername(username: string): Promise<IUser>;
  refreshUser(user: IUser): void;
}

export default IUserProvider;
