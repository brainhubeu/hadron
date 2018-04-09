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

  public loadUserByUsername(username: string): IUser {
    for (const user of this.users) {
      if (user.username === username) {
        return user;
      }
    }

    throw new Error(`User: ${username} does not exists.`);
  }

  public refreshUser(user: IUser): void {
    throw new Error('Method not implemented.');
  }
}

export default InMemoryUserProvider;
