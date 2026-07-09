import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/response';
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function POST(_: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if database already has data
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();

    if (userCount > 0 || categoryCount > 0 || productCount > 0) {
      return successResponse(
        {
          message: 'Database already initialized',
          stats: {
            users: userCount,
            categories: categoryCount,
            products: productCount,
          },
        },
        'Database already has data'
      );
    }

    // Create sample categories
    const sampleCategories = [
      {
        name: 'Ink Cartridges',
        slug: 'ink-cartridges',
        description: 'High quality ink cartridges for all printer models',
      },
      {
        name: 'Toner Cartridges',
        slug: 'toner-cartridges',
        description: 'Professional toner cartridges',
      },
      {
        name: 'Paper',
        slug: 'paper',
        description: 'Premium printing paper',
      },
    ];

    const categories = await Category.insertMany(sampleCategories);
    console.log(`Created ${categories.length} categories`);

    // Create sample products
    const sampleProducts = [
      {
        brand: 'HP',
        title: 'HP Ink Cartridge 65',
        slug: 'hp-ink-cartridge-65',
        price: 29.99,
        oldPrice: 39.99,
        countInStock: 100,
        specifications: {
          color: 'Black',
          volume: '18 ml',
        },
        images: ['https://via.placeholder.com/400x400?text=HP+Cartridge'],
        ratings: 4.5,
        numReviews: 25,
        category: categories[0]._id,
      },
      {
        brand: 'Canon',
        title: 'Canon Ink Cartridge 245',
        slug: 'canon-ink-cartridge-245',
        price: 24.99,
        oldPrice: 34.99,
        countInStock: 150,
        specifications: {
          color: 'Color',
          volume: '15 ml',
        },
        images: ['https://via.placeholder.com/400x400?text=Canon+Cartridge'],
        ratings: 4.3,
        numReviews: 18,
        category: categories[0]._id,
      },
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products`);

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@shopsprinters.com',
      password: 'Admin@123',
      isAdmin: true,
    });

    console.log('Created admin user');

    // Create regular user
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email: 'user@shopsprinters.com',
      password: 'User@123',
      isAdmin: false,
    });

    console.log('Created regular user');

    return successResponse(
      {
        message: 'Database initialized successfully',
        stats: {
          users: 2,
          categories: categories.length,
          products: products.length,
        },
        credentials: {
          admin: {
            email: 'admin@shopsprinters.com',
            password: 'Admin@123',
          },
          user: {
            email: 'user@shopsprinters.com',
            password: 'User@123',
          },
        },
      },
      'Database initialized successfully'
    );
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return errorResponse(error.message || 'Failed to initialize database', 500);
  }
}
