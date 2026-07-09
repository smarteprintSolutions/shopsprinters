import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/response';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = Number(searchParams.get('limit')) || 10;

    if (!q) return successResponse([], 'No query provided');

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const products = await Product.find({ $or: [{ title: { $regex: regex } }, { brand: { $regex: regex } }] })
      .limit(limit)
      .select('title brand')
      .lean();

    const suggestions = products.map((p: any) => (p.brand ? `${p.brand} | ${p.title}` : p.title));

    return successResponse(suggestions, 'Suggestions fetched');
  } catch (error: any) {
    console.error('Error fetching search suggestions', error);
    return errorResponse(error.message || 'Failed to fetch suggestions', 500);
  }
}
