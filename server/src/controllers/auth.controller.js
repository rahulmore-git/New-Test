import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { createHttpError } from '../utils/error.js';
import { issueToken } from '../middleware/auth.js';

export async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, errors.array()[0].msg));
    }
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(createHttpError(409, 'Email already registered'));
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = issueToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, errors.array()[0].msg));
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(401, 'Invalid credentials'));
    const ok = await user.comparePassword(password);
    if (!ok) return next(createHttpError(401, 'Invalid credentials'));
    const token = issueToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('_id name email createdAt updatedAt');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ user });
  } catch (err) {
    next(err);
  }
}


