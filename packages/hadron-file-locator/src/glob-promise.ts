import * as glob from 'glob';

const promise = (pattern: string): Promise<any> =>
  new Promise((resolve, reject) =>
    new glob.Glob(pattern, (err: Error, data: string) => err === null ? resolve(data) : reject(err)));

export default promise;
