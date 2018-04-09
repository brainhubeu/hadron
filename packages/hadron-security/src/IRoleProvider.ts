interface IRoleProvider {
  addRole(role: IRole): void;
  getRole(name: string): IRole;
  getRoles(): string[];
}
