import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/AuthenticationError.js';

const getAccessTokenKey = () => process.env.ACCESS_TOKEN_KEY || 'access_secret';

const authenticateToken = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AuthenticationError('Missing authentication');

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) throw new AuthenticationError('Invalid authentication format');

    const payload = jwt.verify(token, getAccessTokenKey());
    req.auth = { id: payload.id, username: payload.username };
    next();
  } catch (err) {
    if (err instanceof AuthenticationError) return next(err);
    return next(new AuthenticationError('Invalid authentication token'));
  }
};

export default authenticateToken;
