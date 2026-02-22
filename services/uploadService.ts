import axios from "axios";

/**
 * Upload a file to /api/upload
 * @param file - The file to upload
 * @param category - "profiles" or "events"
 * @returns The response with filePath
 */
export const uploadService = {
  async uploadFile(file: File, category: "profiles" | "events") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const response = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    // Response envelope: { success, message, data: { filePath, fileName } }
    return response.data;
  },
};
