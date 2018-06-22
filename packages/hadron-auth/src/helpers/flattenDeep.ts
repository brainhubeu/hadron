const flattenDeep = (arr: any[]): any[] =>
  Array.isArray(arr)
    ? arr.reduce((a, b) => [...flattenDeep(a), ...flattenDeep(b)], [])
    : [arr];

export default flattenDeep;
