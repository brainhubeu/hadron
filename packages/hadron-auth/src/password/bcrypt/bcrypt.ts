import * as bcrypt from 'bcrypt';
import IHashMethod from '../IHashMethod';
import IBcryptOptions from './IBcryptOptions';

export function hash(
  password: string,
  salt?: string,
  options: IBcryptOptions = {},
): Promise<string> {
  if (!salt) {
    return bcrypt
      .genSalt(options.saltRounds)
      .then((salt) => bcrypt.hash(password, salt));
  }
  return bcrypt.hash(password, salt);
}

export function compare(
  userPassword: string,
  hashedPassword: string,
  options?: IBcryptOptions,
): Promise<boolean> {
  return bcrypt.compare(userPassword, hashedPassword);
}

export default function bcryptProvider(options: IBcryptOptions): IHashMethod {
  return {
    hash: (password: string, salt?: string) => hash(password, salt, options),
    compare: (userPassword: string, hashedPassword: string) =>
      compare(userPassword, hashedPassword, options),
  } as IHashMethod;
}
