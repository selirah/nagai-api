import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../entities/User';
import { __User__ } from '../models/__User__';

export const jwtToken = (user: User): string => {
  const payload: __User__ = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    password: user.password,
    isVerified: user.isVerified,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  const token = jwt.sign(payload, config.secretKey, {
    expiresIn: '24h',
  });

  return token;
};
