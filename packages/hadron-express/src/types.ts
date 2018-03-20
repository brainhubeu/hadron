import * as express from 'express';

export type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => any;

export type Callback = (...args: any[]) => any;

export interface IRoute {
  callback: Callback;
  middleware?: Middleware[];
  path: string;
  methods: string[];
}

export interface IRoutesConfig {
  [key: string]: IRoute;
}

export interface IContainer {
  take: (key: string) => any;
}
