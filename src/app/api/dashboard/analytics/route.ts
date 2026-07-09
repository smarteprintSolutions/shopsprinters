import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';

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

    if (!payload.isAdmin) {
      return errorResponse('Admin access required', 403);
    }

    // Fetch analytics data
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .limit(5)
      .sort({ createdAt: -1 });

    const revenue = totalRevenue[0]?.total || 0;
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });

    return successResponse({
      totalOrders,
      totalUsers,
      totalProducts,
      revenue,
      paidOrders,
      deliveredOrders,
      recentOrders,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch analytics', 500);
  }
}
