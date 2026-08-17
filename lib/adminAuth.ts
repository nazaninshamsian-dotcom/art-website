import crypto from 'crypto';

const COOKIE_NAME = 'admin_auth';

function expectedToken() {
  const secret = process.env.ADMIN_PASSWORD || '';
  return crypto.createHash('sha256').update(secret).digest('hex');
}

export function checkPassword(candidate: string) {
  return candidate === process.env.ADMIN_PASSWORD && Boolean(candidate);
}

export function tokenForCookie() {
  return expectedToken();
}

export function isValidToken(token: string | undefined) {
  if (!token) return false;
  return token === expectedToken();
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
