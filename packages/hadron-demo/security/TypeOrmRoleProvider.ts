import { Repository } from 'typeorm';
import IRoleProvider from '../../hadron-security/src/IRoleProvider';
import { IRole } from '../../hadron-security/src/hierarchyProvider';

class TypeOrmRoleProvider implements IRoleProvider {
  constructor(private roleRepository: Repository<IRole>) {}

  public addRole(role: IRole): void {
    throw new Error('Method not implemented.');
  }

  public async getRole(name: string): Promise<IRole> {
    return await this.roleRepository.findOne({ name });
  }

  public async getRoles(): Promise<string[]> {
    const roles = await this.roleRepository.find();
    return roles.map((role) => role.name);
  }
}

export default TypeOrmRoleProvider;
