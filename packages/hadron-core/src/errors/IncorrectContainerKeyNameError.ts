import HadronErrorHandler from '@brainhubeu/hadron-error-handler';

export default class IncorrectContainerKeyNameError extends HadronErrorHandler {
  constructor(key: string, err: Error = new Error()) {
    super();
    this.message = `The key name '${key}' is incorrect to register in container, should be valid variable name.`;
    this.name = 'IncorrectContainerKeyNameError';
    this.stack = null;
    this.error = err;
  }
}
