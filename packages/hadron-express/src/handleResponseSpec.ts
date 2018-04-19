import * as express from 'express';
import * as HTTPStatus from 'http-status';

interface IHeaders {
  [headerName: string]: string;
}

interface IView {
  name: string;
  bindings?: any;
}

type StatusCode =
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

interface IResponseSpec {
  status?: StatusCode;
  redirect?: string;
  headers?: IHeaders;
  body?: any;
  view?: IView;
}

const handleResponseSpec = (res: express.Response) => (
  responseSpec: IResponseSpec,
) => {
  const status = responseSpec.status
    ? responseSpec.status
    : responseSpec.redirect ? HTTPStatus.FOUND : HTTPStatus.OK;
  const headers = responseSpec.headers || {};
  const body = responseSpec.body || {};

  Object.keys(headers).forEach((headerName) => {
    res.set(headerName, headers[headerName]);
  });

  if (responseSpec.redirect) {
    return res.redirect(responseSpec.redirect);
  }

  if (responseSpec.view) {
    const { name, bindings } = responseSpec.view;
    return res.render(name, bindings);
  }

  res.status(status).send(body);
};

export default handleResponseSpec;
