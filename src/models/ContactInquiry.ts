import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'resolved';
  createdAt: Date;
}

const contactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'replied', 'resolved'], default: 'new' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>('ContactInquiry', contactInquirySchema);
