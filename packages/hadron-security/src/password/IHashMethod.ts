export default interface IHashMethod {
  hash(password: string, salt?: string, options?: object): Promise<string>;
  compare(
    userPassword: string,
    hashedPassword: string,
    salt?: string,
    options?: object,
  ): Promise<boolean>;
};
