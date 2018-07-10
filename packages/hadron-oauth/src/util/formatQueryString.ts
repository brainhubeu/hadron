import { IQueryObject } from '../types';

export default (query: IQueryObject): string => {
  return Object.keys(query).reduce((acc, i) => {
    return `${acc}${i}=${query[i]}&`;
  }, '');
};
