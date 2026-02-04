import { createUser as createUserService } from '../services/user.service.js';

export const createUser = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body;
    const userId = await createUserService({ username, password, fullname });
    res.status(201).json({ status: 'success', data: { userId } });
  } catch (err) {
    next(err);
  }
};
