import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  code: string;
  type?: string;
  expiresAt: Date;
  createdAt: Date;
  registrationData?: {
    firstName: string;
    lastName: string;
    password: string;
  };
}

const otpSchema = new Schema<IOTP>(
  {
    email: { type: String, required: true, lowercase: true },
    code: { type: String, required: true },
    type: { type: String, default: 'general' },
    expiresAt: { type: Date, required: true },
    registrationData: {
      firstName: String,
      lastName: String,
      password: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);
