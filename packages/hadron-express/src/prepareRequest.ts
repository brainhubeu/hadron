import * as express from 'express';

interface IRequest {
  locals: any;
  headers: any;
  body: any;
  params: any[];
  query: any[];
}

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
  };
};

export default prepareRequest;
