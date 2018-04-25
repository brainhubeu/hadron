import * as globToRegexp from 'glob-to-regexp';

export const convertToPattern = (url: string): string => {
  const regexp = url[0] === '/' ? url.substring(1) : url;
  return `^/?${regexp.replace(/\/\*/g, '($|/$|/[^/]*$)')}$`;
};

const urlGlob = (pattern: string, input: string): boolean => {
  const re = globToRegexp(pattern);
  return re.test(input);
};

export default urlGlob;
