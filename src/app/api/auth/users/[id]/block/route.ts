import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
import User from '@/models/User';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = await getTokenFromRequest(req);
    if (!token) {
      return errorResponse('No authorization token provided', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    if (!payload.isAdmin) {
      return errorResponse('Admin access required', 403);
    }

    const { id } = await context.params;
    const user = await User.findById(id);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    if (user.isAdmin) {
      return errorResponse('Cannot modify admin user', 400);
    }

    user.isBlocked = true;
    await user.save();

    return successResponse({ message: 'User blocked successfully' });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to block user', 500);
  }
}
