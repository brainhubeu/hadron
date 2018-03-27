class HadronErrorHandler extends Error {
  public error?: Error;
  constructor(message: string = null, error: Error = null) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
};

export default HadronErrorHandler;
