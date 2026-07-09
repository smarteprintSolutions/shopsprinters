import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
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

    if (!payload.isAdmin) {
      return errorResponse('Admin access required', 403);
    }

    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('fetchAll') === 'true';
    const pageSize = 20;
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';

    const query: any = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }

    if (fetchAll) {
      const users = await User.find(query).select('-password');
      return successResponse({ users, page: 1, pages: 1, count: users.length });
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return successResponse({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch users', 500);
  }
}
