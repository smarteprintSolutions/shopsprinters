import mongoose, { Schema, Document } from 'mongoose';
import '@/models/Category';

export interface IProduct extends Document {
  brand: string;
  title: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  price: number;
  oldPrice: number;
  countInStock: number;
  productType?: string;
  usageCategory?: string;
  allInOneType?: string;
  mainFunction?: string;
  wirelessCapability?: string;
  systemDomain?: string;
  assetModelName?: string;
  color?: string;
  screenSize?: string;
  width?: string;
  height?: string;
  depth?: string;
  msrp?: number;
  units?: number;
  keywords?: string[];
  highlights?: string[];
  description?: string;
  overview?: string;
  technicalSpecification?: string;
  technicalSpecificationRows?: Array<{
    label: string;
    value: string;
  }>;
  testimonials?: string[];
  mediaUrls?: string[];
  specifications: {
    color?: string;
    width?: string;
    height?: string;
    depth?: string;
    screenSize?: string;
    [key: string]: any;
  };
  reviews: Array<{
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  images: string[];
  ratings: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    brand: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    productType: String,
    usageCategory: String,
    allInOneType: String,
    mainFunction: String,
    wirelessCapability: String,
    systemDomain: String,
    assetModelName: String,
    color: String,
    screenSize: String,
    width: String,
    height: String,
    depth: String,
    msrp: Number,
    units: Number,
    keywords: [String],
    highlights: [String],
    description: String,
    overview: String,
    technicalSpecification: String,
    technicalSpecificationRows: [{ label: String, value: String }],
    testimonials: [String],
    mediaUrls: [String],
    specifications: {
      color: String,
      width: String,
      height: String,
      depth: String,
      screenSize: String,
    },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    images: [String],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
