interface IUserProvider {
  loadUserByUsername(username: string): IUser;
  refreshUser(user: IUser): void;
}
