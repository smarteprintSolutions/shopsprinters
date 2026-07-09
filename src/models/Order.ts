import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    title: string;
    image: string;
  }>;
  shippingAddress: {
    fullName?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
  };
  itemsPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        title: String,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true, default: '' },
      country: { type: String, required: true },
      phone: String,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,
    status: { type: String, default: 'pending' },
    trackingNumber: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
