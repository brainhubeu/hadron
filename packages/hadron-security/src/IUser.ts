interface IUser {
  id: number | string;
  username: string;
  password: string;
  roles: IRole[];
}
