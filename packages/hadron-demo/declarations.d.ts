declare module 'xmljson';
declare module 'glob';
declare module 'xml2js';
declare module '@hadron/events';
declare module '@hadron/express';
declare module '@hadron/core';
declare module '@hadron/json-provider';
declare module '@hadron/serialization';
declare module '@hadron/typeorm';

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
