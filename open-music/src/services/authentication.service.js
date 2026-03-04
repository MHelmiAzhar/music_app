import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/AuthenticationError.js';
import ClientError from '../exceptions/ClientError.js';
import InvariantError from '../exceptions/InvariantError.js';
import { findUserByUsername } from '../repositories/user.repository.js';
import {
  insertRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from '../repositories/authentication.repository.js';

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new InvariantError(`${key} is required`);
  return value;
};

const getAccessTokenKey = () => requireEnv('ACCESS_TOKEN_KEY');
const getRefreshTokenKey = () => requireEnv('REFRESH_TOKEN_KEY');
const getAccessTokenAge = () => requireEnv('ACCESS_TOKEN_AGE');

const generateAccessToken = (payload) =>
  jwt.sign(payload, getAccessTokenKey(), { expiresIn: getAccessTokenAge() });
const generateRefreshToken = (payload) => jwt.sign(payload, getRefreshTokenKey());

export const login = async ({ username, password }) => {
  const user = await findUserByUsername(username);
  if (!user) throw new AuthenticationError('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthenticationError('Invalid credentials');

  const payload = { id: user.id, username: user.username };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await insertRefreshToken(refreshToken);

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async ({ refreshToken }) => {
  const tokenRow = await findRefreshToken(refreshToken);
  if (!tokenRow) throw new ClientError('Invalid refresh token');

  let payload;
  try {
    payload = jwt.verify(refreshToken, getRefreshTokenKey());
  } catch {
    throw new ClientError('Invalid refresh token');
  }

  const accessToken = generateAccessToken({ id: payload.id, username: payload.username });
  return accessToken;
};

export const revokeRefreshToken = async ({ refreshToken }) => {
  const deleted = await deleteRefreshToken(refreshToken);
  if (!deleted) throw new ClientError('Invalid refresh token');
};
