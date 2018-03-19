export default class HadronRouterError extends Error {
  // tslint:disable-next-line:no-unused-variable
  private error?: Error;
  constructor(message = 'Invalid route method error', error: Error = null) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'RouterError';
    this.error = error;
  }
}
