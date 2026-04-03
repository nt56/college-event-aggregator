import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { saveUploadedFile, UploadCategory } from "@/lib/upload";
import { successResponse, ApiErrors, errorResponse } from "@/lib/api-response";

/**
 * POST /api/upload
 * Upload an image file.
 * Body: FormData with "file" field and "category" field ("profiles" | "events")
 * Returns: { filePath: "/uploads/profiles/abc.jpg" }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "profiles";

    if (!file || !(file instanceof File)) {
      return ApiErrors.badRequest(
        "No file provided. Send a 'file' field in FormData.",
      );
    }

    if (!["profiles", "events"].includes(category)) {
      return ApiErrors.badRequest(
        "Invalid category. Must be 'profiles' or 'events'.",
      );
    }

    const result = await saveUploadedFile(file, category as UploadCategory);

    if (!result.success) {
      return errorResponse(result.error, 400);
    }

    return successResponse(
      {
        filePath: result.filePath,
        fileName: result.fileName,
        publicId: result.publicId,
      },
      "File uploaded successfully",
      201,
    );
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return ApiErrors.internalError();
  }
}
