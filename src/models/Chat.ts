import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  user: mongoose.Types.ObjectId;
  messages: Array<{
    sender: 'user' | 'admin';
    content: string;
    isRead: boolean;
    timestamp: Date;
  }>;
  status: 'active' | 'closed';
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    lastMessage: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);
