import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ApiError from '../app/errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err: any) {
    if (err) {
      // console.log(err);
      // console.error('JWT verification error:', err.message);
      // return;
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Token has expired.');
      }
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid token.');
    }
  }
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
