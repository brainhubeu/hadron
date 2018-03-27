import HadronErrorHandler from '../../../hadron-error-handler';

export default class LoadingPackageError extends HadronErrorHandler {
  public log: any;
  constructor(err: Error) {
    super();
    this.message = `Problem with loading package`;
    this.name = 'LoadingPackageError';
    this.stack = null;
    this.error = err;
  }
}
