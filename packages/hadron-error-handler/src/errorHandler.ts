class HadronErrorHandler extends Error {
  public error?: Error;
  constructor(message: string = 'Hadron unhandled error') {
    super(message);
    this.stack = new Error().stack;
  }
}

export default HadronErrorHandler;
