import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { sendContactReply, sendContactNotification } from '@/lib/email';
import { errorResponse, successResponse, validationError } from '@/lib/response';
import { sanitizeString, validateEmail } from '@/utils/validation';
import ContactInquiry from '@/models/ContactInquiry';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = 20;

    const query: any = {};
    if (status) query.status = status;

    const total = await ContactInquiry.countDocuments(query);
    const inquiries = await ContactInquiry.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    return successResponse({
      inquiries,
      page,
      pages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch inquiries', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, subject, message, phone } = await req.json();
    const errors: Record<string, string> = {};

    if (!name?.trim()) errors.name = 'Name is required';
    if (!validateEmail(email)) errors.email = 'Valid email is required';
    if (!subject?.trim()) errors.subject = 'Subject is required';
    if (!message?.trim()) errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      return validationError(errors);
    }

    const inquiry = await ContactInquiry.create({
      name: sanitizeString(name),
      email: email.toLowerCase(),
      subject: sanitizeString(subject),
      message: sanitizeString(message),
      phone,
      status: 'new',
    });

    // Send inquiry to admin inbox (contact-form@shopsprinters.com)
    // and confirmation reply to the user
    try {
      await Promise.all([
        sendContactNotification(name, email, subject, message, phone),
        sendContactReply(email, subject, message),
      ]);
    } catch (err) {
      console.error('Failed to send contact emails:', err);
    }

    return successResponse(inquiry, 'Inquiry submitted successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to submit inquiry', 500);
  }
}
