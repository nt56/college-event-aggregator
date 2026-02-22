import { NextRequest } from "next/server";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/lib/validators/auth";
import {
  successResponse,
  errorResponse,
  formatZodErrors,
  ApiErrors,
} from "@/lib/api-response";
import { requireAuth } from "@/lib/auth-guard";

/**
 * GET /api/auth/profile
 * Get current user's profile
 */
export async function GET() {
  const authResult = await requireAuth();

  if (!authResult.success) {
    return authResult.response;
  }

  return successResponse(
    {
      user: authResult.session.user,
      userId: authResult.userId,
      role: authResult.userRole,
      email: authResult.userEmail,
    },
    "Profile retrieved successfully",
  );
}

/**
 * PATCH /api/auth/profile
 * Update current user's profile (firstName, lastName, phone, bio, collegeId)
 * Updates BOTH Better Auth user and MongoDB user.
 */
export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth();

  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    // Validate input
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiErrors.validationError(formatZodErrors(validationResult.error));
    }

    const { firstName, lastName, phone, bio, collegeId, gender, dateOfBirth } =
      validationResult.data;

    // Accept profileImage from body (separate from validated fields)
    const profileImage = body.profileImage;

    // Build Better Auth update (it only knows about "name")
    const betterAuthUpdate: Record<string, string> = {};
    if (firstName || lastName) {
      // We need current values if only one is provided
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      if (fullName) betterAuthUpdate.name = fullName;
    }

    // Update Better Auth user if name changed
    if (Object.keys(betterAuthUpdate).length > 0) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await fetch(`${appUrl}/api/auth/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: appUrl,
          Cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify(betterAuthUpdate),
      });
    }

    // Update MongoDB user with all fields
    const { connectDB } = await import("@/lib/db");
    const User = (await import("@/models/User")).default;
    await connectDB();

    const updateData: Record<string, unknown> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (collegeId !== undefined) updateData.collegeId = collegeId || undefined;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await User.findOneAndUpdate(
      { email: authResult.userEmail },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return errorResponse("User profile not found", 404);
    }

    return successResponse(
      {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        profileImage: updatedUser.profileImage || null,
        collegeId: updatedUser.collegeId?.toString(),
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
      },
      "Profile updated successfully",
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return ApiErrors.internalError();
  }
}

/**
 * POST /api/auth/profile
 * Change password for current user
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();

  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const body = await request.json();

    // Validate input
    const validationResult = changePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiErrors.validationError(formatZodErrors(validationResult.error));
    }

    const { currentPassword, newPassword } = validationResult.data;

    // Forward to Better Auth change password endpoint
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const authResponse = await fetch(`${appUrl}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: appUrl,
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      const errorMessage =
        authData.message || authData.error || "Failed to change password";

      if (
        errorMessage.toLowerCase().includes("incorrect") ||
        errorMessage.toLowerCase().includes("wrong")
      ) {
        return errorResponse("Current password is incorrect", 401);
      }

      return errorResponse(errorMessage, authResponse.status);
    }

    return successResponse(null, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    return ApiErrors.internalError();
  }
}
