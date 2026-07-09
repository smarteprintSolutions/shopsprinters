import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse, validationError } from '@/lib/response';
import ReturnRequest from '@/models/ReturnRequest';

export async function GET(req: NextRequest) {
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

    let query: any = {};
    if (!payload.isAdmin) {
      query.user = payload.id;
    }

    const returns = await ReturnRequest.find(query)
      .populate('order')
      .populate('product')
      .populate('user', 'name email');

    return successResponse(returns);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch returns', 500);
  }
}

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

    const { orderId, productId, reason } = await req.json();
    const errors: Record<string, string> = {};

    if (!orderId) errors.orderId = 'Order ID is required';
    if (!productId) errors.productId = 'Product ID is required';
    if (!reason) errors.reason = 'Reason is required';

    if (Object.keys(errors).length > 0) {
      return validationError(errors);
    }

    const returnRequest = await ReturnRequest.create({
      order: orderId,
      user: payload.id,
      product: productId,
      reason,
      status: 'pending',
    });

    return successResponse(returnRequest, 'Return request submitted', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create return request', 500);
  }
}
