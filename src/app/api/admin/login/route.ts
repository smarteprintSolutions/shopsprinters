import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';

/**
 * POST /api/admin/login
 * Expects JSON: { username, password, callbackUrl }
 * On success, sets cookie `admin-auth=true` and returns JSON.
 */
export async function POST(request: Request) {
  try {
    const { username, password, callbackUrl } = await request.json();
    if (username === 'admin' && password === 'admin123') {
      const token = await generateToken('admin-user', 'admin@shopsprinters.com', true);
      const response = NextResponse.json({ message: 'Login successful', callbackUrl }, { status: 200 });

      response.cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });

      response.cookies.set('admin-auth', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return response;
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}
