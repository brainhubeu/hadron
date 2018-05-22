import * as express from 'express';
import * as HTTPStatus from 'http-status';
import { IResponseSpec, IPartialResponseSpec, IResponseOptions } from './types';

const getClass = (val: any) => Object.prototype.toString.call(val).slice(8, -1);

const isPrimitive = (val: any) => {
  return ['String', 'Number', 'Null', 'Undefined'].includes(getClass(val));
};

const handleResponseSpec = (
  res: express.Response,
  options: IResponseOptions = { partial: false },
) => (responseSpec: IResponseSpec) => {
  if (isPrimitive(responseSpec)) {
    return res.json(responseSpec);
  }

  const status = responseSpec.status
    ? responseSpec.status
    : responseSpec.redirect ? HTTPStatus.FOUND : HTTPStatus.OK;
  const headers = responseSpec.headers || {};
  const body = responseSpec.body || {};

  Object.keys(headers).forEach((headerName) => {
    res.set(headerName, headers[headerName]);
  });

  res.status(status);

  if (options.partial) {
    return;
  }

  if (responseSpec.redirect) {
    return res.redirect(responseSpec.redirect);
  }

  if (responseSpec.view) {
    const { name, bindings } = responseSpec.view;
    return res.render(name, bindings);
  }

  res.json(body);
};

export default handleResponseSpec;
