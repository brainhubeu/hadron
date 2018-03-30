const responses = {
  successGet(data: any) {
    this.status(200).json({
      data,
      success: true,
    });
  },

  successUpdate(data: any) {
    this.status(201).json({
      data,
      success: true,
    });
  },

  entityValidationError(error: Error) {
    this.status(400).json({
      message: error.message,
      error: 'entity_validation_error',
      success: false,
    });
  },

  serverError(message: string) {
    this.status(500).json({
      message,
      error: 'server_error',
      success: false,
    });
  },

  notFound(message: string) {
    return this.status(404).json({
      message,
      success: false,
      error: 'not_found',
    });
  },
};

export default (req: any, res: any, next: any) => {
  Object.assign(res, responses);
  next();
};
