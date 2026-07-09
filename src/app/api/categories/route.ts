import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/response';
import Category from '@/models/Category';
import { generateSlug } from '@/utils/validation';

export async function GET(_: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find({});
    return successResponse(categories, 'Categories fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch categories', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, description, image } = await req.json();

    const category = await Category.create({
      name,
      slug: generateSlug(name),
      description,
      image,
    });

    return successResponse(category, 'Category created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create category', 500);
  }
}
