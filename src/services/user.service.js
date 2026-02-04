import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import InvariantError from '../exceptions/InvariantError.js';
import { findUserByUsername, insertUser } from '../repositories/user.repository.js';

export const createUser = async ({ username, password, fullname }) => {
  const existingUser = await findUserByUsername(username);
  if (existingUser) throw new InvariantError('Username already exists');

  const userId = nanoid(16);
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await insertUser({ id: userId, username, password: hashedPassword, fullname });
  return result.id;
};
