import crypto from 'crypto';

/**
 * Hash password using PBKDF2 (Node.js built-in)
 * For production, use bcrypt instead
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, originalHash] = hash.split(':');
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return newHash === originalHash;
}

/**
 * Generate JWT token (mock implementation)
 * For production, use jsonwebtoken library
 */
export function generateToken(userId: number, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    })
  ).toString('base64');
  
  return `${header}.${payload}.signature`;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: 'investor' | 'startup' | 'admin';
  is_verified: boolean;
}
