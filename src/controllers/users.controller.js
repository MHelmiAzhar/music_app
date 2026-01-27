import pool from '../utils/db.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import InvariantError from '../exceptions/InvariantError.js';

export const createUser = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body;

    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rowCount > 0) throw new InvariantError('Username already exists');

    const userId = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
      [userId, username, hashedPassword, fullname]
    );

    res.status(201).json({ status: 'success', data: { userId: result.rows[0].id } });
  } catch (err) {
    next(err);
  }
};
