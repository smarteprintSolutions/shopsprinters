import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';
import { errorResponse, successResponse } from '@/lib/response';
import Chat from '@/models/Chat';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = await getTokenFromRequest(req);
    if (!token) {
      return errorResponse('No authorization token provided', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    let query: any = {};
    if (!payload.isAdmin) {
      query.user = payload.id;
    }

    const chats = await Chat.find(query).populate('user', 'name email');
    return successResponse(chats);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch chats', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = await getTokenFromRequest(req);
    if (!token) {
      return errorResponse('No authorization token provided', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    const { message } = await req.json();

    let chat = await Chat.findOne({ user: payload.id, status: 'active' });

    if (!chat) {
      chat = await Chat.create({
        user: payload.id,
        messages: [{ sender: 'user', content: message, isRead: false, timestamp: new Date() }],
        status: 'active',
        lastMessage: message,
      });
    } else {
      chat.messages.push({
        sender: 'user' as const,
        content: message,
        isRead: false,
        timestamp: new Date(),
      });
      chat.lastMessage = message;
      await chat.save();
    }

    return successResponse(chat, 'Message sent successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to send message', 500);
  }
}
