import ClientError from './ClientError.js';

export default class NotFoundError extends ClientError {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}