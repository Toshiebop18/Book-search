import { Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

const secretKey = process.env.JWT_SECRET_KEY || '';

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    return { user: decoded };
  } catch (error) {
    console.error('Invalid token:', error);
    return { user: null };
  }
};

export const signToken = (_id: string, username: string, email: string) => {
  const payload = { _id, username, email };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
