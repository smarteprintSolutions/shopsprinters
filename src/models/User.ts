import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isBlocked: boolean;
  avatar?: string;
  cart: Array<{
    product: mongoose.Types.ObjectId;
    title: string;
    image: string;
    price: number;
    countInStock: number;
    slug: string;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        title: { type: String },
        image: { type: String },
        price: { type: Number },
        countInStock: { type: Number },
        slug: { type: String },
        quantity: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
