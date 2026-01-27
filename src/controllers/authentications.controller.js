import pool from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/AuthenticationError.js';
import InvariantError from '../exceptions/InvariantError.js';
import ClientError from '../exceptions/ClientError.js';

const getAccessTokenKey = () => process.env.ACCESS_TOKEN_KEY || 'access_secret';
const getRefreshTokenKey = () => process.env.REFRESH_TOKEN_KEY || 'refresh_secret';
const getAccessTokenAge = () => process.env.ACCESS_TOKEN_AGE || '1h';

const generateAccessToken = (payload) => jwt.sign(payload, getAccessTokenKey(), { expiresIn: getAccessTokenAge() });
const generateRefreshToken = (payload) => jwt.sign(payload, getRefreshTokenKey());

export const postAuthentication = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userResult = await pool.query('SELECT id, username, password FROM users WHERE username = $1', [username]);
    if (userResult.rowCount === 0) throw new AuthenticationError('Invalid credentials');

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthenticationError('Invalid credentials');

    const payload = { id: user.id, username: user.username };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await pool.query('INSERT INTO authentications(token) VALUES($1)', [refreshToken]);

    res.status(201).json({ status: 'success', data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

export const putAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new InvariantError('refreshToken is required');

    const tokenResult = await pool.query('SELECT token FROM authentications WHERE token = $1', [refreshToken]);
    if (tokenResult.rowCount === 0) throw new ClientError('Invalid refresh token');

    let payload;
    try {
      payload = jwt.verify(refreshToken, getRefreshTokenKey());
    } catch {
      throw new ClientError('Invalid refresh token');
    }

    const accessToken = generateAccessToken({ id: payload.id, username: payload.username });
    res.json({ status: 'success', data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const deleteAuthentication = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new InvariantError('refreshToken is required');

    const result = await pool.query('DELETE FROM authentications WHERE token = $1', [refreshToken]);
    if (result.rowCount === 0) throw new ClientError('Invalid refresh token');

    res.json({ status: 'success', message: 'Refresh token deleted' });
  } catch (err) {
    next(err);
  }
};
