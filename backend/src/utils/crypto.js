import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const createToken = async (payload, secret) => {
  // 30 days token expiry
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 30 * 24 * 60 * 60;
  return sign({ ...payload, exp }, secret);
};

export const verifyJwt = async (token, secret) => {
  try {
    return await verify(token, secret);
  } catch {
    return null;
  }
};

export const getJwtSecret = (env) => {
  return env?.JWT_SECRET || 'dsa_tracker_jwt_secret_edge_key_secure_2026';
};

export const verifyToken = verifyJwt;
