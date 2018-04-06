class InMemoryProvider implements IUserProvider {
  private users: IUser[] = [];

  public loadUserByUsername(username: string): IUser {
    for (const user of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  // tslint:disable-next-line:no-empty
  public refreshUser() {}
}
