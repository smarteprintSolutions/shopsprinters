import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse, validationError } from '@/lib/response';
import User from '@/models/User';

export async function POST(req: NextRequest) {
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

    const user = await User.findById(payload.id);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const { cartItems } = await req.json();

    if (!Array.isArray(cartItems)) {
      return validationError({ cart: 'Cart items must be an array' });
    }

    user.cart = cartItems;
    await user.save();

    return successResponse({ success: true }, 'Cart saved successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to save cart', 500);
  }
}
