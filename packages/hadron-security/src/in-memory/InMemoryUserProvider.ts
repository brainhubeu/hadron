import IUserProvider from '../IUserProvider';
import { IUser } from '../hierarchyProvider';

class InMemoryUserProvider implements IUserProvider {
  private users: IUser[] = [];

  public addUser(user: IUser): void {
    for (const existingUser of this.users) {
      if (existingUser.username === user.username) {
        throw new Error(`User: ${user.username} already exists.`);
      }
    }

    this.users.push(user);
  }

  public loadUserByUsername(username: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      for (const user of this.users) {
        if (user.username === username) {
          resolve(user);
        }
      }

      reject(new Error(`User: ${username} does not exists.`));
    });
  }

  public refreshUser(user: IUser): void {
    throw new Error('Method not implemented.');
  }
}

export default InMemoryUserProvider;
