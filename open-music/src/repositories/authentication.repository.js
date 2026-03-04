import pool from '../utils/db.js';

export const insertRefreshToken = async (token) => {
  await pool.query('INSERT INTO authentications(token) VALUES($1)', [token]);
};

export const findRefreshToken = async (token) => {
  const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
  return result.rows[0] ?? null;
};

export const deleteRefreshToken = async (token) => {
  const result = await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  return result.rowCount;
};
