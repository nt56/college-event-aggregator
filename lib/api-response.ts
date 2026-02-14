import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/**
 * Format Zod validation errors into a user-friendly format
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root";
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return errors;
}

/**
 * Standard API response format for success responses
 */
export function successResponse<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

/**
 * Standard API response format for error responses
 */
export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors: errors || null,
    },
    { status },
  );
}

/**
 * Common error responses
 */
export const ApiErrors = {
  unauthorized: () => errorResponse("Unauthorized. Please log in.", 401),
  forbidden: () => errorResponse("Forbidden. You don't have permission.", 403),
  notFound: (resource = "Resource") =>
    errorResponse(`${resource} not found.`, 404),
  badRequest: (message: string, errors?: Record<string, string[]>) =>
    errorResponse(message, 400, errors),
  internalError: () =>
    errorResponse("Internal server error. Please try again later.", 500),
  validationError: (errors: Record<string, string[]>) =>
    errorResponse("Validation failed.", 400, errors),
};
