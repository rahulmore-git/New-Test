import jwt from 'jsonwebtoken';
import { createHttpError } from '../utils/error.js';

export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.substring(7) : null;
    const cookieToken = req.cookies?.token;
    const jwtToken = token || cookieToken;
    if (!jwtToken) throw createHttpError(401, 'Authentication required');
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    return next(createHttpError(401, 'Invalid or expired token'));
  }
}

export function issueToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}


