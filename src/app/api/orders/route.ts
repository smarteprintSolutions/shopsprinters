import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
import Order from '@/models/Order';
import User from '@/models/User';

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

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = 10;

    let query: any = {};

    // Admins see all orders, users see only their own
    if (!payload.isAdmin) {
      query.user = payload.id;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email firstName lastName')
      .populate('orderItems.product', 'title price image')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    return successResponse({
      orders,
      page,
      pages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch orders', 500);
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

    const data = await req.json();
    const shippingAddress = data?.shippingAddress || {};

    const normalizedShippingAddress = {
      fullName: shippingAddress.fullName || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
      address: shippingAddress.address || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      postalCode: shippingAddress.postalCode || shippingAddress.zip || '',
      country: shippingAddress.country || '',
      phone: shippingAddress.phone || '',
    };

    const order = await Order.create({
      ...data,
      shippingAddress: normalizedShippingAddress,
      user: payload.id,
      status: 'pending',
    });

    // Update user's cart to empty after order
    await User.findByIdAndUpdate(payload.id, { cart: [] });

    return successResponse(order, 'Order created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create order', 500);
  }
}
