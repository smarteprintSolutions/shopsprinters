export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d+\-().\s]{10,}$/;
  return phoneRegex.test(phone);
}

export function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
