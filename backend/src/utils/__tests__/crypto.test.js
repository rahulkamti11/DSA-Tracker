import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, createToken, verifyJwt, getJwtSecret } from '../crypto.js';

describe('Backend Crypto Utilities (crypto.js)', () => {
  it('hashPassword should generate a secure bcrypt salt and hash', async () => {
    const raw = 'SuperSecret123!';
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    expect(hashed.startsWith('$2a$') || hashed.startsWith('$2b$')).toBe(true);
  });

  it('comparePassword should return true for valid password and false for wrong password', async () => {
    const raw = 'MyPassword456';
    const hashed = await hashPassword(raw);

    const isMatch = await comparePassword(raw, hashed);
    expect(isMatch).toBe(true);

    const isWrong = await comparePassword('WrongPassword', hashed);
    expect(isWrong).toBe(false);
  });

  it('createToken and verifyJwt should sign and verify HS256 token payloads', async () => {
    const secret = 'test_jwt_secret_key_12345';
    const payload = { id: 'user-xyz-987' };

    const token = await createToken(payload, secret);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verified = await verifyJwt(token, secret);
    expect(verified).not.toBeNull();
    expect(verified.id).toBe('user-xyz-987');
    expect(verified.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('verifyJwt should return null for invalid token or wrong secret', async () => {
    const secret1 = 'secret_one';
    const secret2 = 'secret_two';
    const token = await createToken({ id: 'user-1' }, secret1);

    const fail = await verifyJwt(token, secret2);
    expect(fail).toBeNull();

    const tampered = await verifyJwt(token + 'tampered', secret1);
    expect(tampered).toBeNull();
  });

  it('getJwtSecret should prefer env.JWT_SECRET or use safe fallback', () => {
    expect(getJwtSecret({ JWT_SECRET: 'custom_env_secret' })).toBe('custom_env_secret');
    expect(getJwtSecret({})).toContain('dsa_tracker_jwt_secret');
    expect(getJwtSecret(undefined)).toContain('dsa_tracker_jwt_secret');
  });
});
