import { verifyJwt, getJwtSecret } from '../utils/crypto.js';

export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'No authorization token, access denied' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = getJwtSecret(c.env);

  const decoded = await verifyJwt(token, jwtSecret);
  if (!decoded || !decoded.id) {
    return c.json({ message: 'Token is invalid or expired' }, 401);
  }

  c.set('userId', decoded.id);
  c.set('user', decoded);

  await next();
};
