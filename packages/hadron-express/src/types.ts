import * as express from 'express';

export type Middleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => any;

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

export type RoutePathsConfig = string[][];

export interface IContainer {
  take: (key: string) => any;
  keys: () => string[];
}

export interface IHeaders {
  [headerName: string]: string;
}

export interface IView {
  name: string;
  bindings?: any;
}

export type StatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511;

export interface IResponseSpec {
  status?: StatusCode;
  redirect?: string;
  headers?: IHeaders;
  body?: any;
  view?: IView;
}

export interface IRequest {
  locals?: any;
  headers?: any;
  body?: any;
  params?: any[];
  query?: any[];
  file?: any;
  files?: any;
}
export interface IHadronExpressConfig {
  routes: IRoutesConfig;
  routePaths: RoutePathsConfig;
}
