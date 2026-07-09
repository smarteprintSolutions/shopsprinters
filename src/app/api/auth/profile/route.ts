import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { getTokenFromRequest, verifyToken, generateToken, setAuthCookie } from '@/lib/jwt';
import { errorResponse, successResponse, validationError } from '@/lib/response';
import { sanitizeString, validateEmail, validatePassword } from '@/utils/validation';
import User from '@/models/User';

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

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      cart: user.cart || [],
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch profile', 500);
  }
}

export async function PUT(req: NextRequest) {
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

    const user = await User.findById(payload.id);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const data = await req.json();
    const errors: Record<string, string> = {};

    // Validate updates
    if (data.firstName !== undefined) {
      if (!data.firstName.trim()) errors.firstName = 'First name cannot be empty';
      else user.firstName = sanitizeString(data.firstName);
    }

    if (data.lastName !== undefined) {
      if (!data.lastName.trim()) errors.lastName = 'Last name cannot be empty';
      else user.lastName = sanitizeString(data.lastName);
    }

    if (data.email !== undefined) {
      if (!validateEmail(data.email)) errors.email = 'Invalid email';
      else {
        const existing = await User.findOne({ email: data.email, _id: { $ne: user._id } });
        if (existing) errors.email = 'Email already in use';
        else user.email = data.email.toLowerCase();
      }
    }

    if (data.password !== undefined) {
      const passwordCheck = validatePassword(data.password);
      if (!passwordCheck.valid) {
        errors.password = passwordCheck.errors[0];
      } else {
        if (data.password !== data.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          user.password = data.password;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors);
    }

    if (data.firstName || data.lastName) {
      user.name = `${user.firstName} ${user.lastName}`;
    }

    const updatedUser = await user.save();
    const newToken = await generateToken(updatedUser._id.toString(), updatedUser.email, updatedUser.isAdmin);
    await setAuthCookie(newToken);

    return successResponse({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: newToken,
      createdAt: updatedUser.createdAt,
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update profile', 500);
  }
}
