import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class LoggerNameIsRequiredError extends HadronErrorHandler {
  constructor(error: Error = new Error()) {
    super(`logger name is required to register in hadron`);
    this.error = error;
    this.stack = error.stack;
  }
}
