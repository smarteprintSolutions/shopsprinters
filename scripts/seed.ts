import 'dotenv/config';
import { connectDB, disconnectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';

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
    images: [
      'https://via.placeholder.com/400x400?text=HP+Cartridge',
    ],
    ratings: 4.5,
    numReviews: 25,
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
    images: [
      'https://via.placeholder.com/400x400?text=Canon+Cartridge',
    ],
    ratings: 4.3,
    numReviews: 18,
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Seed categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Created ${categories.length} categories`);

    // Seed products with category references
    const productsToSeed = sampleProducts.map((product) => ({
      ...product,
      category: categories[0]._id,
    }));

    const products = await Product.insertMany(productsToSeed);
    console.log(`Created ${products.length} products`);

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@shopesprinters.com',
      password: 'Admin@123', // Will be hashed
      isAdmin: true,
    });

    console.log('Created admin user');

    // Create regular user
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email: 'user@shopesprinters.com',
      password: 'User@123', // Will be hashed
      isAdmin: false,
    });

    console.log('Created regular user');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@shopesprinters.com');
    console.log('Password: Admin@123\n');
    console.log('User credentials:');
    console.log('Email: user@shopesprinters.com');
    console.log('Password: User@123\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

seedDatabase();
