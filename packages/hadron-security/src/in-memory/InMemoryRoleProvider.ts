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

  public getRole(name: string): Promise<IRole> {
    return new Promise((resolve, reject) => {
      for (const role of this.roles) {
        if (role.name === name) {
          resolve(role);
        }
      }

      reject(new Error(`Role: ${name} does not exists.`));
    });
  }

  public getRoles(): Promise<string[]> {
    return Promise.resolve(this.roles.map((role) => role.name));
  }
}

export default InMemoryRoleProvider;
