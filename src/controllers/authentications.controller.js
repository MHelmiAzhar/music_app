import InvariantError from '../exceptions/InvariantError.js';
import {
  login,
  refreshAccessToken,
  revokeRefreshToken,
} from '../services/authentication.service.js';

export const postAuthentication = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await login({ username, password });
    res.status(201).json({ status: 'success', data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

export const putAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new InvariantError('refreshToken is required');

    const accessToken = await refreshAccessToken({ refreshToken });
    res.json({ status: 'success', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const deleteAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new InvariantError('refreshToken is required');
    await revokeRefreshToken({ refreshToken });
    res.json({ status: 'success', message: 'Refresh token deleted' });
  } catch (err) {
    next(err);
  }
};
