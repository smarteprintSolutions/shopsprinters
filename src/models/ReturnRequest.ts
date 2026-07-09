import mongoose, { Schema, Document } from 'mongoose';

export interface IReturnRequest extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    comment: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>('ReturnRequest', returnRequestSchema);
