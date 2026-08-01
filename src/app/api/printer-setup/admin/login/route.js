import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Password123';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
