import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/response';
import Category from '@/models/Category';
import { generateSlug } from '@/utils/validation';

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category, 'Category fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch category', 500);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { name, description, image } = await req.json();

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: name ? generateSlug(name) : undefined,
        description,
        image,
      },
      { new: true }
    );

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category, 'Category updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update category', 500);
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse({ _id: id }, 'Category deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete category', 500);
  }
}
