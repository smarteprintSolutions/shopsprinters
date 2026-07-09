import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey12345');

export interface JWTPayload {
  id: string;
  email: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

export async function generateToken(userId: string, email: string, isAdmin: boolean = false) {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 days

  const payload = {
    id: userId,
    email,
    isAdmin,
    iat: now,
    exp: now + expiresIn,
  };

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey12345');
    const token = await new (await import('jose')).SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    return token;
  } catch (error) {
    throw new Error('Failed to generate token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const authCookie = cookies.find((cookie) => cookie.startsWith('auth_token='));

  if (authCookie) {
    return decodeURIComponent(authCookie.split('=')[1]);
  }

  return null;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}
