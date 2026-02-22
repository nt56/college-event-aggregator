import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export type UploadCategory = "profiles" | "events";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadResult {
  success: true;
  filePath: string; // e.g. "/uploads/profiles/abc123.webp"
  fileName: string;
}

interface UploadError {
  success: false;
  error: string;
}

/**
 * Save an uploaded file to public/uploads/<category>/
 * Returns the public URL path (relative to domain root).
 */
export async function saveUploadedFile(
  file: File,
  category: UploadCategory,
): Promise<UploadResult | UploadError> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type "${file.type}". Allowed: ${ALLOWED_TYPES.join(", ")}`,
    };
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 5MB`,
    };
  }

  // Generate unique filename
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

  // Ensure directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads", category);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Write file
  const buffer = Buffer.from(await file.arrayBuffer());
  const fullPath = path.join(uploadDir, uniqueName);
  await writeFile(fullPath, buffer);

  const publicPath = `/uploads/${category}/${uniqueName}`;

  return {
    success: true,
    filePath: publicPath,
    fileName: uniqueName,
  };
}

/**
 * Delete an uploaded file (best-effort, won't throw)
 */
export async function deleteUploadedFile(publicPath: string): Promise<boolean> {
  try {
    const { unlink } = await import("fs/promises");
    const fullPath = path.join(process.cwd(), "public", publicPath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
