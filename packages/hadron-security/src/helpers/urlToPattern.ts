const replaceAll = (
  target: string,
  search: string,
  replacement: string,
): string => {
  return target.replace(new RegExp(search, 'g'), replacement);
};

const convertToPattern = (url: string): string => {
  let regexp = url[0] === '/' ? url.substring(1) : url;
  regexp = `^/?${regexp}`;
  regexp = `${regexp.replace('/*', '($|/$|/[^/]*$)')}`;
  regexp = `${replaceAll(regexp, '/', '\\/')}`;
  return regexp;
};
