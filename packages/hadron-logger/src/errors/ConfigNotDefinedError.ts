import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class ConfigNotDefinedError extends HadronErrorHandler {
  constructor(error: Error = new Error()) {
    super(`Config for hadron-logger package has not been found`);
    this.error = error;
    this.stack = error.stack;
  }
}
