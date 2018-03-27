import HadronErrorHandler from '../../../hadron-error-handler';

export default class InvalidRouteMethodError extends HadronErrorHandler {
  constructor(route: string, method: string) {
    super();
    this.message = `Invalid route method '${method}' in ${route} route`;
    this.name = 'InvalidRouteError';
  }
}
