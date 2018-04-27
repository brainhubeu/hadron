const countStars = (input: string) => {
  try {
    return input.match(/\*\*/g).length;
  } catch (error) {
    return 0;
  }
};

export const convertToPattern = (url: string): string => {
  const regexp = url[0] === '/' ? url.substring(1) : url;
  if (url.endsWith('/*') && countStars(url) === 0) {
    return `^/?${regexp.replace(/\/\*/g, '($|/$|/[^/]*$)')}$`;
  }
  if (url.endsWith('/**') && countStars(url) === 1) {
    return `^/?${regexp.replace(/\/\*\*/g, '($|/.*$)')}$`;
  }

  if (countStars(url) === 0) {
    return `^/?${url}$`;
  }

  return convertToPattern(regexp.replace('**', '[^/]*'));
};

const urlGlob = (pattern: string, input: string): boolean => {
  const re = new RegExp(convertToPattern(pattern));
  return re.test(input);
};

export default urlGlob;
