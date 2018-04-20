import * as express from 'express';
import { IRequest } from './types';

const prepareRequest = (
  expressRequest: express.Request,
  locals = {},
): IRequest => {
  return {
    locals,
    headers: expressRequest.headers,
    body: expressRequest.body,
    params: expressRequest.params,
    query: expressRequest.query,
    file: expressRequest.file,
    files: expressRequest.files,
  };
};

export default prepareRequest;
