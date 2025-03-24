import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new GraphQLError('Unauthorized', {
      extensions: { code: 'UNAUTHENTICATED' }
    }));
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return next(new GraphQLError('Forbidden', {
        extensions: { code: 'FORBIDDEN' }
      }));
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
