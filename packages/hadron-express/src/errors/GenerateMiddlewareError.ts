import HadronErrorHandler from '../../../hadron-error-handler';

export default class GenerateMiddlewareError extends HadronErrorHandler {
  constructor(error: Error) {
    super();
    this.name = 'GenerateMiddlewareError';
    this.error = error;
  }
}
