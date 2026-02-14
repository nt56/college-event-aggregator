import { NextRequest } from "next/server";
import { signUpSchema } from "@/lib/validators/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  successResponse,
  errorResponse,
  formatZodErrors,
  ApiErrors,
} from "@/lib/api-response";

/**
 * POST /api/auth/register
 * Custom registration endpoint with validation.
 *
 * SECURITY: Role is ALWAYS "student". Users cannot choose their role.
 * Only an admin can promote users to organizer/admin via PATCH /api/users/:id
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiErrors.validationError(formatZodErrors(validationResult.error));
    }

    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      dateOfBirth,
      phone,
      collegeId,
    } = validationResult.data;

    // Full name for Better Auth (it requires a "name" field)
    const fullName = `${firstName} ${lastName}`;

    // Forward to Better Auth signup endpoint
    // Better Auth stores: name, email, password (hashed), role="student" (default)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const authResponse = await fetch(`${appUrl}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: appUrl,
      },
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        // role is NOT sent — defaults to "student" in Better Auth config
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      const errorMessage =
        authData.message || authData.error || "Registration failed";

      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("already registered")
      ) {
        return errorResponse("An account with this email already exists", 409);
      }

      return errorResponse(errorMessage, authResponse.status);
    }

    // Create MongoDB user profile with extended fields
    await connectDB();

    // Check if MongoDB user already exists (edge case)
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create({
        firstName,
        lastName,
        email,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        phone,
        role: "student", // ALWAYS student on registration
        collegeId: collegeId || undefined,
        authUserId: authData.user?.id,
      });
    }

    return successResponse(
      {
        user: {
          id: authData.user?.id,
          firstName,
          lastName,
          email,
          role: "student",
        },
      },
      "Registration successful! Welcome aboard.",
      201,
    );
  } catch (error) {
    console.error("Registration error:", error);
    return ApiErrors.internalError();
  }
}
