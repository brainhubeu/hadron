import { Repository } from 'typeorm';
import { IRole, IRoleProvider } from '@brainhubeu/hadron-security';

class TypeOrmRoleProvider implements IRoleProvider {
  constructor(private roleRepository: Repository<IRole>) {}

  public async getRole(name: string): Promise<IRole> {
    return await this.roleRepository.findOne({ name });
  }

  public async getRoles(): Promise<string[]> {
    const roles = await this.roleRepository.find();
    return roles.map((role) => role.name);
  }
}

export default TypeOrmRoleProvider;
