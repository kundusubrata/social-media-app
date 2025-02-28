class CustomErrorHandler extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomErrorHandler;