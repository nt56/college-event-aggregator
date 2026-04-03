import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
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
 * Calls Better Auth directly (no self-fetch) to avoid CSRF / port / JSON issues.
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

    // Call Better Auth directly — returns a standard Response with Set-Cookie
    const authResponse = await auth.api.signInEmail({
      body: { email, password, rememberMe },
      asResponse: true,
    });

    if (!authResponse.ok) {
      // Try to parse JSON error, fall back to generic message
      let errorMessage = "Login failed";
      try {
        const errData = await authResponse.json();
        errorMessage = errData.message || errData.error || errorMessage;
      } catch {
        // response body was not JSON — use generic message
      }

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

    const authData = await authResponse.json();

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
