import { Repository } from 'typeorm';
import { IUser } from '../../hadron-security/src/hierarchyProvider';
import IUserProvider from '../../hadron-security/src/IUserProvider';

class TypeOrmUserProvider implements IUserProvider {
  constructor(private userRepository: Repository<IUser>) {}

  public addUser(user: IUser): void {
    throw new Error('Method not implemented.');
  }

  public async loadUserByUsername(username: string): Promise<IUser> {
    return await this.userRepository.findOne({
      relations: ['roles'],
      where: { username },
    });
  }

  public refreshUser(user: IUser): void {
    throw new Error('Method not implemented.');
  }
}

export default TypeOrmUserProvider;
