const toCamelCase = (str: string) =>
  str
    .replace(/-/g, ' ')
    .replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .replace(/\s+/g, '');

export default toCamelCase;
