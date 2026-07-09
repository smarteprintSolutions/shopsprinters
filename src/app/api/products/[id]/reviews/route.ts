import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse, unauthorizedResponse, validationError } from '@/lib/response';
import Product from '@/models/Product';
import { verifyToken, getAuthCookie } from '@/lib/jwt';

async function getUserFromRequest(req: Request) {
  // Try Authorization header first
  const authHeader = (req as any).headers?.get?.('authorization') || null;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];

  if (!token) {
    // Try cookie
    token = await getAuthCookie();
  }

  if (!token) return null;
  const payload = await verifyToken(token);
  return payload;
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { rating, comment } = body;

    const errors: Record<string, string> = {};
    if (!rating || Number(rating) <= 0) errors.rating = 'Rating is required';
    if (!comment || !String(comment).trim()) errors.comment = 'Comment is required';
    if (Object.keys(errors).length) return validationError(errors);

    const product = await Product.findById(id);
    if (!product) return errorResponse('Product not found', 404);

    const newReview = {
      user: user.id,
      rating: Number(rating),
      comment: String(comment),
      createdAt: new Date(),
    } as any;

    product.reviews = product.reviews || [];
    product.reviews.push(newReview as any);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / product.reviews.length;

    await product.save();

    return successResponse(newReview, 'Review added successfully', 201);
  } catch (error: any) {
    console.error('Error in POST /api/products/:id/reviews', error);
    return errorResponse(error.message || 'Failed to add review', 500);
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { reviewId, rating, comment } = body;
    if (!reviewId) return validationError({ reviewId: 'reviewId is required' });

    const product = await Product.findById(id);
    if (!product) return errorResponse('Product not found', 404);

    const review = product.reviews.find((r: any) => String((r as any)._id) === String(reviewId));
    if (!review) return errorResponse('Review not found', 404);

    if (String((review as any).user) !== String(user.id) && !user.isAdmin) {
      return unauthorizedResponse('Not allowed to edit this review');
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = String(comment);

    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / product.reviews.length;

    await product.save();

    return successResponse(review, 'Review updated successfully');
  } catch (error: any) {
    console.error('Error in PUT /api/products/:id/reviews', error);
    return errorResponse(error.message || 'Failed to update review', 500);
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const user = await getUserFromRequest(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { reviewId } = body;
    if (!reviewId) return validationError({ reviewId: 'reviewId is required' });

    const product = await Product.findById(id);
    if (!product) return errorResponse('Product not found', 404);

    const reviewIndex = product.reviews.findIndex((r: any) => String((r as any)._id) === String(reviewId));
    if (reviewIndex === -1) return errorResponse('Review not found', 404);

    const review = product.reviews[reviewIndex];
    if (String((review as any).user) !== String(user.id) && !user.isAdmin) {
      return unauthorizedResponse('Not allowed to delete this review');
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / product.reviews.length : 0;

    await product.save();

    return successResponse({ removed: true }, 'Review removed successfully');
  } catch (error: any) {
    console.error('Error in DELETE /api/products/:id/reviews', error);
    return errorResponse(error.message || 'Failed to delete review', 500);
  }
}
