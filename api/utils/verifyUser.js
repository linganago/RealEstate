// utils/verifyUser.js
import jwt from 'jsonwebtoken';
import { errorhandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorhandler(401, 'Unauthorized: Token not found'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorhandler(403, 'Invalid token'));

    req.user = decoded; // Attach the decoded user info (e.g., user id)
    next();
  });
};