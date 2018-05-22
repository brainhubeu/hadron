import * as express from 'express';
import * as HTTPStatus from 'http-status';
import { IResponseSpec, IPartialResponseSpec } from './types';

const getClass = (val: any) => Object.prototype.toString.call(val).slice(8, -1);

const isPrimitive = (val: any) => {
  return ['String', 'Number', 'Null', 'Undefined'].includes(getClass(val));
};

const handleResponseSpec = (res: express.Response) => (
  responseSpec: IResponseSpec | IPartialResponseSpec,
) => {
  if (isPrimitive(responseSpec)) {
    return res.json(responseSpec);
  }

  const status = responseSpec.status
    ? responseSpec.status
    : responseSpec.type === 'RESPONSE' && responseSpec.redirect
      ? HTTPStatus.FOUND
      : HTTPStatus.OK;
  const headers = responseSpec.headers || {};

  Object.keys(headers).forEach((headerName) => {
    res.set(headerName, headers[headerName]);
  });

  res.status(status);

  if (responseSpec.type === 'PARTIAL_RESPONSE') {
    return;
  }

  const body = responseSpec.body || {};

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
