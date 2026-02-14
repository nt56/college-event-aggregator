import { NextRequest } from "next/server";
import { signInSchema } from "@/lib/validators/auth";
import {
  successResponse,
  errorResponse,
  formatZodErrors,
  ApiErrors,
} from "@/lib/api-response";

/**
 * POST /api/auth/login
 * Custom login endpoint with validation
 *
 * This endpoint validates the login data before passing it to Better Auth.
 * It provides better error messages and user-friendly responses.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validationResult = signInSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiErrors.validationError(formatZodErrors(validationResult.error));
    }

    const { email, password, rememberMe } = validationResult.data;

    // Forward to Better Auth signin endpoint
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const authResponse = await fetch(`${appUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: appUrl,
      },
      body: JSON.stringify({
        email,
        password,
        rememberMe,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      // Handle Better Auth errors with user-friendly messages
      const errorMessage = authData.message || authData.error || "Login failed";

      // Check for specific error types
      if (
        errorMessage.toLowerCase().includes("invalid") ||
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("not found")
      ) {
        return errorResponse("Invalid email or password", 401);
      }

      if (errorMessage.toLowerCase().includes("verified")) {
        return errorResponse("Please verify your email before logging in", 403);
      }

      return errorResponse(errorMessage, authResponse.status);
    }

    // Get cookies from Better Auth response to forward to client
    const cookies = authResponse.headers.get("set-cookie");

    const response = successResponse(
      { user: authData.user, session: authData.session },
      "Login successful! Welcome back.",
      200,
    );

    // Forward auth cookies
    if (cookies) {
      response.headers.set("set-cookie", cookies);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return ApiErrors.internalError();
  }
}
