interface IUserProvider {
  addUser(user: IUser): void;
  loadUserByUsername(username: string): IUser;
  refreshUser(user: IUser): void;
}
