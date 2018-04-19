import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class CouldNotRegisterLoggerInContainerError extends HadronErrorHandler {
  constructor(name: string, error: Error = new Error()) {
    super(`Could not create and register logger '${name}' in container.`);
    this.error = error;
    this.stack = error.stack;
  }
}
