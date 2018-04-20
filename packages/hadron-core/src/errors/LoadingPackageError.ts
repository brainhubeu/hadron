import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class LoadingPackageError extends HadronErrorHandler {
  constructor(err: Error) {
    super();
    this.message = `Problem with loading package`;
    this.name = 'LoadingPackageError';
    this.stack = null;
    this.error = err;
  }
}
