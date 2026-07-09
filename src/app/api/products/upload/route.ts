import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/response';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    // Only JSON base64 images supported in this environment.
    const json = await req.json();
    if (!json || !Array.isArray(json.images)) {
      return errorResponse('Image upload requires JSON payload { images: ["data:image/...base64,..."] } in this environment', 400);
    }

    const urls: string[] = [];
    for (const b64 of json.images) {
      const match = String(b64).match(/^data:.*;base64,(.*)$/);
      const raw = match ? match[1] : b64;
      const buffer = Buffer.from(raw, 'base64');
      const url = await uploadToCloudinary(buffer, 'products');
      urls.push(url);
    }

    return successResponse(urls, 'Images uploaded (JSON)');
  } catch (error: any) {
    console.error('Image upload error', error);
    return errorResponse(error.message || 'Image upload failed', 500);
  }
}
