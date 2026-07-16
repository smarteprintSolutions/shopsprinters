import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { errorResponse, successResponse } from '@/lib/response';
import { generateSlug } from '@/utils/validation';
import Product from '@/models/Product';
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const limitParam = searchParams.get('limit');
    const pageSize = limitParam && limitParam !== 'all' ? Number(limitParam) || 12 : 12;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };

    if (limitParam === 'all') {
      const products = await Product.find(query)
        .populate('category')
        .sort({ createdAt: -1 })
        .allowDiskUse(true)
        .lean();
      const total = products.length;
      return NextResponse.json({ products, page: 1, pages: 1, total });
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 })
        .allowDiskUse(true)
        .lean()
    ]);

    return NextResponse.json({ products, page, pages: Math.ceil(total / pageSize), total });
  } catch (error: any) {
    console.error('GET /api/products error:', error);
    return errorResponse(error.message || 'Failed to fetch products', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

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

    const productPayload = {
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

    const product = await Product.create(productPayload);
    return successResponse(product, 'Product created successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create product', 500);
  }
}
