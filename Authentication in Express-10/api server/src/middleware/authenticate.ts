import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET } from '#config';

const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');
  const accessToken = authHeader?.startsWith('Bearer') && authHeader.split(' ')[1];

  if (!accessToken) throw new Error('Not authenticated', { cause: { status: 401 } });
  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;

    // if there is now decoded.sub if false, throw a 403 error and indicate Invalid or expired token
    if (!decoded.sub) throw new Error('Invalid access token.', { cause: { status: 403 } });

    const user = {
      id: decoded.sub,
      roles: decoded.roles
    };
    req.user = user;

    next();
  } catch (error) {
    // if error is an because token was expired, call next with a 401 and `ACCESS_TOKEN_EXPIRED' code
    if (error instanceof jwt.TokenExpiredError) {
      next(new Error('Expired access token', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } }));
    } else {
      // call next with a new 401 Error indicated invalid access token
      next(new Error('Invalid access token.', { cause: { status: 401 } }));
    }
  }
};

export default authenticate;
