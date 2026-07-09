import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
import Order from '@/models/Order';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = await getTokenFromRequest(req);
    let payload: any = null;

    if (token) {
      payload = await verifyToken(token);
    }

    const { id } = await context.params;

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    if (payload && !payload.isAdmin && order.user?._id?.toString() !== payload.id) {
      return errorResponse('Unauthorized', 403);
    }

    return successResponse(order);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch order', 500);
  }
}

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
    const data = await req.json();

    const order = await Order.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order, 'Order updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update order', 500);
  }
}
