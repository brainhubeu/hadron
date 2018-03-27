import HadronErrorHandler from '../../../hadron-error-handler';

export default class NoRouterMethodSpecifiedError extends HadronErrorHandler {
  private package: string = 'hadron-express';
  constructor(route: string) {
    super();
    this.message = `No route methods were specified for ${route} route`;
    this.name = 'NoRouterMethodSpecifiedError';
  }
}
