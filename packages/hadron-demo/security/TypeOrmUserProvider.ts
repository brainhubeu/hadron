import { Repository } from 'typeorm';
import { IUser, IUserProvider } from '@brainhubeu/hadron-security';

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
