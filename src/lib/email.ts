import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const OTP_FROM = process.env.MAIL_FROM || process.env.EMAIL_FROM || '"ShopsPrinters" <no-reply@shopsprinters.com>';
const CONTACT_RECEIVER = process.env.CONTACT_RECEIVER || process.env.CONTACT_RECEIVER_EMAIL || 'contact-form@shopsprinters.com';

function getTransporter() {
  if (transporter) return transporter;

  // Support both SMTP_ and EMAIL_ env var naming conventions
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '465');
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!host || !user || !pass) {
    console.warn('[Email] Configuration missing — host:', host, 'user:', user, 'pass:', pass ? '***' : 'MISSING');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
  });

  return transporter;
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const t = getTransporter();

    if (!t) {
      console.warn('[Email] Not configured — OTP would be:', otp);
      return false;
    }

    const fromAddress = process.env.SMTP_USER || 'no-reply@shopsprinters.com';

    const info = await t.sendMail({
      from: OTP_FROM,
      to: email,
      subject: 'Your OTP Code for ShopsPrinters',
      envelope: { from: fromAddress, to: email },
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0072b5; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">SHOPS<span style="color: #1e293b;">PRINTERS</span></h1>
          </div>
          <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 800; text-align: center;">Verify Your Email</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #475569; text-align: center;">Your One-Time Password (OTP) for account verification is:</p>
            <div style="font-size: 42px; font-weight: 900; letter-spacing: 8px; color: #0072b5; margin: 30px 0; text-align: center; background-color: #f0f7ff; padding: 20px; border-radius: 12px;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} ShopsPrinters. All rights reserved.</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 5px 0 0;">This is an automated security notification.</p>
          </div>
        </div>
      `,
    });

    console.log('[Email] OTP sent:', { to: email, messageId: info.messageId, response: info.response });
    return true;
  } catch (error: any) {
    console.error('[Email] Error sending OTP:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });
    return false;
  }
}

export async function sendRegistrationNotification(name: string, email: string) {
  try {
    const t = getTransporter();

    if (!t) {
      console.warn('[Email] Not configured — skipping registration notification');
      return false;
    }

    const fromAddress = process.env.SMTP_USER || 'no-reply@shopsprinters.com';

    await t.sendMail({
      from: OTP_FROM,
      to: CONTACT_RECEIVER,
      envelope: { from: fromAddress, to: CONTACT_RECEIVER },
      subject: 'New User Registration - ShopsPrinters',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New User Registration</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Time:</b> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Email] Error sending registration notification:', error);
    return false;
  }
}

export async function sendContactNotification(name: string, email: string, subject: string, message: string, phone?: string) {
  try {
    const t = getTransporter();

    if (!t) {
      console.warn('[Email] Not configured — skipping contact notification');
      return false;
    }

    // Send the inquiry to the admin inbox
    const fromAddress = process.env.SMTP_USER || 'no-reply@shopsprinters.com';

    await t.sendMail({
      from: OTP_FROM,
      to: CONTACT_RECEIVER,
      replyTo: email,
      envelope: { from: fromAddress, to: CONTACT_RECEIVER },
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #111827;">New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px 12px; font-weight: bold; color: #374151;">Name</td><td style="padding: 8px 12px; color: #6b7280;">${name}</td></tr>
            <tr><td style="padding: 8px 12px; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px 12px; color: #6b7280;">${email}</td></tr>
            ${phone ? `<tr><td style="padding: 8px 12px; font-weight: bold; color: #374151;">Phone</td><td style="padding: 8px 12px; color: #6b7280;">${phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 12px; font-weight: bold; color: #374151;">Subject</td><td style="padding: 8px 12px; color: #6b7280;">${subject}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Message:</p>
            <p style="color: #6b7280; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Email] Error sending contact notification:', error);
    return false;
  }
}

export async function sendContactReply(email: string, subject: string, message: string) {
  try {
    const t = getTransporter();

    if (!t) {
      console.warn('[Email] Not configured — cannot send contact reply');
      return false;
    }

    const fromAddress = process.env.SMTP_USER || 'no-reply@shopsprinters.com';

    await t.sendMail({
      from: OTP_FROM,
      to: email,
      envelope: { from: fromAddress, to: email },
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Thank You for Contacting Us</h2>
          <p>We have received your inquiry and will get back to you shortly.</p>
          <p><b>Your Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Email] Error sending contact reply:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const t = getTransporter();
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    if (!t) {
      console.warn('[Email] Not configured — cannot send password reset email');
      return false;
    }

    const fromAddress = process.env.SMTP_USER || 'no-reply@shopsprinters.com';

    await t.sendMail({
      from: OTP_FROM,
      to: email,
      envelope: { from: fromAddress, to: email },
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #0072b5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('[Email] Error sending password reset:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

