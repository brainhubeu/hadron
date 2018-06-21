export interface IContainer {
  register: (key: string, value: any, lifecycle?: string) => any;
  take: (key: string) => any;
  keys: () => string[];
}

export interface IOAuthConfig {
  google?: {
    clientID: string;
    clientSecret: string;
    scope: string[];
    redirectUri: string;
    authUrl?: string;
    tokenUrl?: string;
    responseType?: string;
    grantType?: string;
  };
  facebook?: {
    clientID: string;
    clientSecret: string;
    redirectUri: string;
    scope: string[];
    authUrl?: string;
    tokenUrl?: string;
    responseType?: string;
  };
}

export interface IQueryObject {
  [index: string]: any;
}
