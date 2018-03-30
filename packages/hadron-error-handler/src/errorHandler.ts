class HadronErrorHandler extends Error {
  public error?: Error;
  constructor(message: string = 'Hadron unhandled error') {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HadronErrorHandler;
