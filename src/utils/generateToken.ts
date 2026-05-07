import jwt, { type Secret } from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET as Secret;
  const expiresIn = process.env.JWT_EXPIRE ?? '1h';
  const options = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    options
  );
};