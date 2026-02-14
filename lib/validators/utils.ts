import { ZodError, ZodIssue } from "zod";

/**
 * Format Zod validation errors into a structured object
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce(
    (acc: Record<string, string[]>, issue: ZodIssue) => {
      const path = issue.path.join(".");
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(issue.message);
      return acc;
    },
    {},
  );
}
