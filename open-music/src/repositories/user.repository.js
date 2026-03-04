import pool from '../utils/db.js';

export const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT id, username, password FROM users WHERE username = $1', [username]);
  return result.rows[0] ?? null;
};

export const findUserById = async (id) => {
  const result = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
  return result.rows[0] ?? null;
};

export const insertUser = async ({ id, username, password, fullname }) => {
  const result = await pool.query(
    'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
    [id, username, password, fullname]
  );
  return result.rows[0];
};
