import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class NoRouterMethodSpecifiedError extends HadronErrorHandler {
  constructor(route: string) {
    super();
    this.message = `No route methods were specified for ${route} route`;
    this.name = 'NoRouterMethodSpecifiedError';
  }
}
