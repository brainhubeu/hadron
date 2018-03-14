import Response from "./Response";

const METHOD = {
  DELETE: "del",
  GET: "get",
  PATCH: "patch",
  POST: "post",
  PUT: "put",
};

export default class Client {
  public superagent: any;
  public host: string;
  public headers: object;
  constructor(superagent) {
    this.superagent = superagent;
    this.headers = {};

    Object.keys(METHOD).forEach((methodKey) => {
      const method = METHOD[methodKey.toUpperCase()];
      this[methodKey.toLowerCase()] = (path, body) => {
        return this.createRequest(method, path, body);
      };
    });
  }

  public setHost(host) {
    this.host = host;
  }

  public createRequest(method, path, body) {
    const request = this.superagent[method.toLowerCase()](this.host + path);

    this.addRequestHeaders(request);

    const createdRequest = method.toLowerCase() !== "get"
      ? request.send(body)
      : request;

    //
    return createdRequest
      .then(
        // tslint:disable:no-shadowed-variable
        ({ body, status }) => new Response(body, status),
        ({ response: { body, status } }) => new Response(body, status),
      );
  }

  public addRequestHeaders(request) {
    Object.keys(this.headers).map((name) => {
      request.set(name, this.headers[name]);
    });
  }

  public setHeader(name, value) {
    this.headers[name] = value;
  }
}
