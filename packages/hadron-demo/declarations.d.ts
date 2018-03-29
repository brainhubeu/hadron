declare module 'xmljson';
declare module 'glob';
declare module 'xml2js';

declare module '*.json' {
  const value: any;
  // @ts-ignore
  export default value;
}
declare module '*.js' {
  const value: any;
  // @ts-ignore
  export default value;
}
