class HadronErrorHandler extends Error {
  public error?: Error;
  constructor(message: string = null, error: Error = null) {
    super(message);
    // this.stack = err.stack || (new Error(err.message)).stack;
    Error.captureStackTrace(this, this.constructor);
  }
};

export default HadronErrorHandler;
