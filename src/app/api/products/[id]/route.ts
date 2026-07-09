import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse } from '@/lib/response';
import Product from '@/models/Product';
import { generateSlug } from '@/utils/validation';
import { uploadToCloudinary } from '@/lib/cloudinary';

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const normalizeSpecRows = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((row: any) => row && (row.label || row.value))
      .map((row: any) => ({ label: String(row.label || '').trim(), value: String(row.value || '').trim() }))
      .filter((row) => row.label || row.value);
  }

  if (typeof value === 'string') {
    return value
      .split(/\n/)
      .map((row) => row.trim())
      .filter(Boolean)
      .map((row) => {
        const [label, ...valueParts] = row.split(':');
        return { label: label?.trim() || '', value: valueParts.join(':').trim() };
      })
      .filter((row) => row.label || row.value);
  }

  return [];
};

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const product = await Product.findById(id).populate('category');
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch product', 500);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const contentType = req.headers.get('content-type') || '';
    let data: any = {};
    let newImageUrls: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        if (key !== 'images') {
          try {
            data[key] = JSON.parse(value as string);
          } catch {
            data[key] = value;
          }
        }
      });
      const images = formData.getAll('images');
      for (const image of images) {
        if (typeof image === 'object' && 'arrayBuffer' in image) {
          const buffer = Buffer.from(await image.arrayBuffer());
          const url = await uploadToCloudinary(buffer, 'products');
          newImageUrls.push(url);
        } else if (typeof image === 'string') {
          newImageUrls.push(image);
        }
      }
      const existingImages = data.existingImages || [];
      const existingArray = Array.isArray(existingImages) ? existingImages : [existingImages];
      data.images = [...existingArray, ...newImageUrls];
    } else {
      data = await req.json();
    }

    const payload = {
      ...data,
      slug: data.slug || generateSlug(data.title || data.assetModelName || data.brand || 'product'),
      keywords: normalizeList(data.keywords),
      highlights: normalizeList(data.highlights || data.shortDetails),
      testimonials: normalizeList(data.testimonials),
      mediaUrls: normalizeList(data.mediaUrls || data.images),
      images: normalizeList(data.images || data.mediaUrls),
      description: data.overview || data.description || '',
      overview: data.overview || data.description || '',
      technicalSpecification: Array.isArray(data.technicalSpecificationRows)
        ? data.technicalSpecificationRows.map((row: any) => `${row.label}: ${row.value}`).join('\n')
        : data.technicalSpecification || '',
      technicalSpecificationRows: normalizeSpecRows(data.technicalSpecificationRows),
      specifications: {
        color: data.color || data.specifications?.color || '',
        width: data.width || data.specifications?.width || '',
        height: data.height || data.specifications?.height || '',
        depth: data.depth || data.specifications?.depth || '',
        screenSize: data.screenSize || data.specifications?.screenSize || '',
      },
    };

    const product = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update product', 500);
  }
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return NextResponse.json({ _id: id });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete product', 500);
  }
}
