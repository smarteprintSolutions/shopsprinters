import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './jwt';
import User from '@/models/User';
import { connectDB } from './db';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: any
  ) {
    super(message);
  }
}

export async function handleAPIError(error: any) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, ...(error.data && { data: error.data }) },
      { status: error.statusCode }
    );
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors as any)
      .map((err: any) => err.message)
      .join(', ');
    return NextResponse.json({ error: messages }, { status: 400 });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      { error: `${field} already exists` },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: error.message || 'Internal Server Error' },
    { status: 500 }
  );
}

export async function withAuth(
  handler: (
    req: NextRequest,
    user: any,
    context?: any
  ) => Promise<NextResponse>,
  adminOnly: boolean = false
) {
  return async (req: NextRequest, context?: any) => {
    try {
      await connectDB();

      const token = await getTokenFromRequest(req);
      if (!token) {
        throw new APIError(401, 'No authorization token provided');
      }

      const payload = await verifyToken(token);
      if (!payload) {
        throw new APIError(401, 'Invalid or expired token');
      }

      const user = await User.findById(payload.id);
      if (!user) {
        throw new APIError(401, 'User not found');
      }

      if (user.isBlocked) {
        throw new APIError(403, 'User account has been blocked');
      }

      if (adminOnly && !user.isAdmin) {
        throw new APIError(403, 'Admin access required');
      }

      return handler(req, user, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

export async function withDB(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      await connectDB();
      return await handler(req, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}
