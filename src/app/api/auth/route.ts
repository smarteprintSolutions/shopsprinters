import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { generateToken, setAuthCookie } from '@/lib/jwt';
import { errorResponse, successResponse, createdResponse, validationError } from '@/lib/response';
import { sanitizeEmail, validateEmail, validatePassword, sanitizeString } from '@/utils/validation';
import { sendOTPEmail, generateOTP, sendRegistrationNotification } from '@/lib/email';
import User from '@/models/User';
import OTP from '@/models/OTP';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    let parsedBody: any;
    try {
      parsedBody = await req.json();
    } catch (err) {
      try {
        const text = await req.text();
        console.error('Auth route received non-JSON body:', text.slice(0, 1000));
      } catch (e) {
        console.error('Auth route failed to parse body and to read text', e);
      }
      throw err;
    }

    const { action, ...body } = parsedBody;

    switch (action) {
      case 'register':
        return handleRegister(body);
      case 'login':
        return handleLogin(body);
      case 'send-registration-otp':
        return handleSendRegistrationOTP(body);
      case 'verify-registration-otp':
        return handleVerifyRegistrationOTP(body);
      case 'send-otp':
        return handleSendOTP(body);
      case 'verify-otp':
        return handleVerifyOTP(body);
      default:
        return errorResponse('Invalid action', 400);
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return errorResponse(error.message || 'Authentication failed', 500);
  }
}

async function handleSendRegistrationOTP(data: any) {
  const errors: Record<string, string> = {};

  // Validation
  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!validatePassword(data.password).valid) {
    const passwordErrors = validatePassword(data.password).errors;
    errors.password = passwordErrors.join(', ');
  }
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  const email = sanitizeEmail(data.email);

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse('User already exists with this email', 400);
  }

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete old OTPs for this email
  await OTP.deleteMany({ email, type: 'registration' });

  // Create OTP record with registration data
  await OTP.create({
    email,
    code: otp,
    type: 'registration',
    expiresAt,
    registrationData: {
      firstName: sanitizeString(data.firstName),
      lastName: sanitizeString(data.lastName),
      password: data.password,
    },
  });

  // Send OTP email (optional - don't fail if email not configured)
  try {
    await sendOTPEmail(email, otp);
  } catch (err) {
    console.error('Failed to send OTP email (email may not be configured):', err);
    // Still return success so user can proceed in development
  }

  return successResponse({ success: true }, 'OTP sent to your email');
}

async function handleVerifyRegistrationOTP(data: any) {
  const errors: Record<string, string> = {};

  const otp = data.otp ? String(data.otp).trim() : '';

  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!otp || otp.length !== 6) errors.otp = 'Valid 6-digit OTP is required';

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  const email = sanitizeEmail(data.email);
  console.log(`[DEBUG Auth] Verifying OTP for ${email}, code: ${otp}`);

  // Find OTP record
  const otpRecord = await OTP.findOne({ email, code: otp, type: 'registration' });
  
  if (!otpRecord) {
    console.log(`[DEBUG Auth] No OTP record found for ${email} with code ${otp}`);
    const allOtps = await OTP.find({ email });
    console.log(`[DEBUG Auth] All OTPs for this email:`, allOtps);
    return errorResponse('Invalid or expired OTP', 400);
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpRecord._id });
    return errorResponse('OTP expired', 400);
  }

  const { registrationData } = otpRecord;

  // Check if user already exists (double check)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await OTP.deleteOne({ _id: otpRecord._id });
    return errorResponse('User already exists with this email', 400);
  }

  // Create user
  let user: any;
  try {
    user = await User.create({
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      name: `${registrationData.firstName} ${registrationData.lastName}`,
      email,
      password: registrationData.password,
    });
  } catch (err: any) {
    console.error('Error creating user in DB:', err);
    await OTP.deleteOne({ _id: otpRecord._id });
    throw err;
  }

  // Delete OTP record
  await OTP.deleteOne({ _id: otpRecord._id });

  // Send registration notification (optional)
  try {
    await sendRegistrationNotification(user.name, user.email);
  } catch (err) {
    console.error('Failed to send registration notification:', err);
  }

  return successResponse(
    {
      message: 'Account created successfully. Please login.',
      email: user.email,
    },
    'Account verified successfully'
  );
}

async function handleRegister(data: any) {
  const errors: Record<string, string> = {};

  // Validation
  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!validatePassword(data.password).valid) {
    const passwordErrors = validatePassword(data.password).errors;
    errors.password = passwordErrors.join(', ');
  }
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  const email = sanitizeEmail(data.email);

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse('User already exists with this email', 400);
  }

  // Create user
  let user: any;
  try {
    user = await User.create({
      firstName: sanitizeString(data.firstName),
      lastName: sanitizeString(data.lastName),
      name: `${data.firstName} ${data.lastName}`,
      email,
      password: data.password,
    });
  } catch (err: any) {
    console.error('Error creating user in DB:', err);
    throw err;
  }

  // Send registration notification (optional - don't fail if email not configured)
  try {
    await sendRegistrationNotification(user.name, user.email);
  } catch (err) {
    console.error('Failed to send registration notification (email may not be configured):', err);
  }

  // Generate token and set cookie
  const token = await generateToken(user._id.toString(), user.email, user.isAdmin);
  await setAuthCookie(token);

  return createdResponse(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
      createdAt: user.createdAt,
    },
    'User registered successfully'
  );
}

async function handleLogin(data: any) {
  const errors: Record<string, string> = {};

  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!data.password) errors.password = 'Password is required';

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  const email = sanitizeEmail(data.email);
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(data.password))) {
    return errorResponse('Invalid email or password', 401);
  }

  if (user.isBlocked) {
    return errorResponse('Your account has been blocked', 403);
  }

  // Check admin
  if (data.isAdminLogin && !user.isAdmin) {
    return errorResponse('Admin access required', 403);
  }

  const token = await generateToken(user._id.toString(), user.email, user.isAdmin);
  await setAuthCookie(token);

  return successResponse({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
    cart: user.cart || [],
    createdAt: user.createdAt,
  });
}

async function handleSendOTP(data: any) {
  if (!validateEmail(data.email)) {
    return validationError({ email: 'Valid email is required' });
  }

  const email = sanitizeEmail(data.email);
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete old OTPs
  await OTP.deleteMany({ email });

  // Create new OTP
  await OTP.create({ email, code: otp, expiresAt });

  // Send email
  try {
    await sendOTPEmail(email, otp);
    return successResponse({ success: true }, 'OTP sent to email');
  } catch (error) {
    await OTP.deleteOne({ email, code: otp });
    return errorResponse('Failed to send OTP', 500);
  }
}

async function handleVerifyOTP(data: any) {
  const errors: Record<string, string> = {};

  const otp = data.otp ? String(data.otp).trim() : '';

  if (!validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!otp || otp.length !== 6) errors.otp = 'Valid OTP is required';

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  const email = sanitizeEmail(data.email);
  const otpRecord = await OTP.findOne({ email, code: otp });

  if (!otpRecord) {
    return errorResponse('Invalid OTP', 400);
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpRecord._id });
    return errorResponse('OTP expired', 400);
  }

  await OTP.deleteOne({ _id: otpRecord._id });

  return successResponse({ verified: true }, 'OTP verified successfully');
}
