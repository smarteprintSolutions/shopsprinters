import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Omit<Document, 'model'> {
  model: string;
  name: string;
  phone: string;
  email: string;
  agree: boolean;
  createdAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    model: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    agree: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', registrationSchema);
