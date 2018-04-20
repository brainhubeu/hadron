import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class LoggerAdapterNotDefinedError extends HadronErrorHandler {
  constructor(name: string, error: Error = new Error()) {
    super(`Logger adapter for ${name} has not been not found.`);
    this.error = error;
    this.stack = error.stack;
  }
}
