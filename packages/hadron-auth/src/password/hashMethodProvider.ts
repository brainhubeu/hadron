import bcrypt from './bcrypt/bcrypt';
import ISecurityOptions from '../ISecurityOptions';
import IHashMethod from './IHashMethod';

export interface IHashProviderMap {
  [s: string]: (options?: object) => IHashMethod;
}

const availableMethod: IHashProviderMap = {
  bcrypt,
};

/**
 * Function checks if given object is implementing IHashMethod interface
 * @param {IHashMethod | string} hashMethod
 * @returns {boolean}
 */
function isHashMethod(
  hashMethod: IHashMethod | string,
): hashMethod is IHashMethod {
  return (
    (hashMethod as IHashMethod).compare !== undefined &&
    (hashMethod as IHashMethod).hash !== undefined
  );
}

/**
 * Funtion exctracts hashing method from config. Bcrypt on default.
 * @param config
 * @param methods
 */
export default function hashMethodProvider(
  config: ISecurityOptions,
  methods?: IHashProviderMap,
) {
  const allMethods: IHashProviderMap = { ...availableMethod, ...methods };
  if (config.hash) {
    const { method, options } = config.hash;

    if (typeof method === 'string' && allMethods[method]) {
      return allMethods[method](options);
    }

    if (isHashMethod(method)) {
      return {
        hash: (password: string, salt?: string) =>
          method.hash(password, salt, options),
        compare: (
          userPassword: string,
          hashedPassword: string,
          salt?: string,
        ) => method.compare(userPassword, hashedPassword, salt, options),
      };
    }
  }

  return allMethods.bcrypt();
}
