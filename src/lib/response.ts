import { NextResponse } from 'next/server';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    pages?: number;
    count?: number;
  };
}

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: any
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      ...(meta && { meta }),
    },
    { status: statusCode }
  );
}

export function errorResponse(
  error: string,
  statusCode: number = 400,
  meta?: any
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(meta && { meta }),
    },
    { status: statusCode }
  );
}

export function createdResponse<T>(data: T, message?: string): NextResponse<APIResponse<T>> {
  return successResponse(data, message, 201);
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<APIResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<APIResponse> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Not Found'): NextResponse<APIResponse> {
  return errorResponse(message, 404);
}

export function validationError(errors: Record<string, string>, statusCode: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation Error',
      data: errors,
    },
    { status: statusCode }
  );
}
