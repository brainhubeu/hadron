const replaceAll = (
  target: string,
  search: string,
  replacement: string,
): string => {
  return target.replace(new RegExp(search, 'g'), replacement);
};

export const convertToPattern = (url: string): string => {
  let regexp = url[0] === '/' ? url.substring(1) : url;
  regexp = `^/?${regexp.replace(/\/\*/g, '($|/$|/[^/]*$)')}`;
  console.log(regexp);
  return `${replaceAll(regexp, '/', '/')}$`;
};

const urlGlob = (pattern: string, input: string): boolean => {
  const re = new RegExp(convertToPattern(pattern));
  return re.test(input);
};

export default urlGlob;
