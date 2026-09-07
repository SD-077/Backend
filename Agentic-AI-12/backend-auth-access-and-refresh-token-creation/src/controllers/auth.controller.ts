import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL, SALT_ROUNDS, ACCESS_TOKEN_TTL } from '#config';
import { RefreshToken, User } from '#models';

export const register: RequestHandler = async (req, res) => {
  const {
    body: { email, password, firstName, lastName }
  } = req;

  const found = await User.findOne({ email });
  if (found) throw new Error('User Already Exists!!!', { cause: { status: 409 } });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ email, password: hash, firstName, lastName });

  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  const refreshToken = crypto.randomUUID();
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction,
    maxAge: REFRESH_TOKEN_TTL * 1000
  };

  res.cookie('refreshToken', refreshToken, cookieOptions).json({ accessToken });
};

export const login: RequestHandler = async (req, res) => {
  const {
    body: { email, password }
  } = req;
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid Credintails', { cause: { status: 401 } });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid Credintails', { cause: { status: 401 } });

  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  await RefreshToken.deleteOne({ userId: user._id });

  const refreshToken = crypto.randomUUID();
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction,
    maxAge: REFRESH_TOKEN_TTL * 1000
  };

  res.cookie('refreshToken', refreshToken, cookieOptions).json({ accessToken });
};

export const refresh: RequestHandler = async (req, res) => {
  const oldrRefreshToken = await RefreshToken.findOne({ token: req.cookies.refreshToken });

  if (!oldrRefreshToken) throw new Error('Refresh Token Not Found', { cause: { status: 401 } });

  const user = await User.findById(oldrRefreshToken.userId);

  if (!user) throw new Error('User Not Found', { cause: { status: 401 } });

  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  await RefreshToken.deleteOne({ userId: user._id });

  const refreshToken = crypto.randomUUID();

  await RefreshToken.create({ token: refreshToken, userId: user._id });

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    secure: isProduction,
    maxAge: REFRESH_TOKEN_TTL * 1000
  };

  res.cookie('refreshToken', refreshToken, cookieOptions).json({ accessToken });
};

export const logout: RequestHandler = async (req, res) => {
  // TODO: Implement logout by removing the tokens
  //   Get the refreshToken cookie
  // If a refreshToken cookie is found, delete the corresponding stored token from the database
  // Clear the refreshToken cookie
  // Send a success message in the response body
  res.json({ message: 'DELETE /refresh' });
};

export const me: RequestHandler = async (req, res, next) => {
  // TODO: Implement a me handler
  // Get the access token from the request headers
  // Get the Authorization header from the request
  // Isolate the access token
  // Throw an error if there is not access token
  // Verify the access token
  // If token is expired, add code: ACCESS_TOKEN_EXPIRED to error
  // Query the database for the user who is the sub of the access token
  // Throw an error if no user is found
  // Send user profile with success message in response body
  res.json({ message: 'GET /me' });
};
