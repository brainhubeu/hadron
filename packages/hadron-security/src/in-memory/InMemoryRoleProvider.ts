import IRoleProvider from '../IRoleProvider';
import { IRole } from '../hierarchyProvider';

class InMemoryRoleProvider implements IRoleProvider {
  private roles: IRole[] = [];

  public addRole(role: IRole): void {
    for (const existingRole of this.roles) {
      if (role.name === existingRole.name) {
        throw new Error(`Role: ${role.name} already exists.`);
      }
    }

    this.roles.push(role);
  }

  public getRole(name: string): IRole {
    for (const role of this.roles) {
      if (role.name === name) {
        return role;
      }
    }

    throw new Error(`Role: ${name} does not exists.`);
  }

  public getRoles(): string[] {
    return this.roles.map((role) => role.name);
  }
}

export default InMemoryRoleProvider;
