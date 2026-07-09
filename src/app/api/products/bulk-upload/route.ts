import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/response';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // Only JSON path supported in this environment.
    const json: any = await req.json().catch(() => null);
    if (!json || !Array.isArray(json.rows)) {
      return errorResponse('Bulk upload requires JSON payload { rows: [...] }', 400);
    }

    const created: any[] = [];
    for (const row of json.rows) {
      const title = row.title || row.Name || row.name;
      if (!title) continue;
      const brand = row.brand || 'Generic';
      const categoryName = row.category || 'Uncategorized';

      let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
      if (!category) {
        category = await Category.create({
          name: categoryName,
          slug: String(categoryName).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-'),
        });
      }

      const price = Number(row.price || 0) || 0;
      const countInStock = Number(row.countInStock || 0) || 0;
      const images = Array.isArray(row.images) ? row.images : (row.images ? [row.images] : []);

      const product = await Product.create({
        title,
        brand,
        slug: String(title).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-'),
        category: category._id,
        price,
        countInStock,
        images,
      } as any);

      created.push(product);
    }

    return successResponse({ createdCount: created.length, created }, 'Bulk upload processed (JSON)');
  } catch (error: any) {
    console.error('Bulk upload error', error);
    return errorResponse(error.message || 'Bulk upload failed', 500);
  }
}