import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(_: NextRequest) {
  try {
    await connectDB();

    // Preload categories for matching names
    const categories = await Category.find({ name: { $in: [/Laser/i, /Inkjet/i, /Ink & Toner/i] } }).lean();

    const findCatId = (name: string) => {
      const cat = categories.find((c: any) => c.name.toLowerCase() === name.toLowerCase());
      return cat ? cat._id : null;
    };

    const getCategoryProducts = async (slug: string, usage = false) => {
      try {
        let query: any = {};
        if (usage) {
          query.usageCategory = { $in: [slug] };
        } else {
          const catId = findCatId(slug);
          if (catId) query.category = catId;
          else return [];
        }
        return await Product.find(query).limit(4).populate('category', 'name').lean();
      } catch (err) {
        console.error('Error fetching products for', slug, err);
        return [];
      }
    };

    const results = await Promise.all([
      getCategoryProducts('Home', true),
      getCategoryProducts('Office', true),
      getCategoryProducts('Laser'),
      getCategoryProducts('Inkjet'),
      getCategoryProducts('Ink & Toner'),
    ]);

    return successResponse({ home: results[0], office: results[1], laser: results[2], inkjet: results[3], toner: results[4] }, 'Home products fetched');
  } catch (error: any) {
    console.error('Error in GET /api/products/home', error);
    return errorResponse(error.message || 'Failed to fetch home products', 500);
  }
}
