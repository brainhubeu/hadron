import HadronErrorHandler from '../../../hadron-error-handler';

export default class CreateRouteError extends HadronErrorHandler {
  private package: string = 'hadron-express';
  constructor(routeName: string, error: Error) {
    super(`Cannot create route ${routeName}`);
    this.error = error;
    this.stack = null;
  }
}
