import ClientError from './ClientError.js';

export default class AuthorizationError extends ClientError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}
