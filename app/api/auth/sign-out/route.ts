import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * POST /api/auth/sign-out
 * Custom sign-out endpoint that wraps Better Auth's sign-out.
 * Returns a personalized message with the user's name.
 * This avoids the "Missing or null Origin" error from non-browser clients like Postman.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current session to extract user info before signing out
    const session = await auth.api.getSession({ headers: request.headers });
    const userName = session?.user?.name || "User";

    // Build a proper Request object with Origin header for Better Auth's CSRF check
    const appUrl =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const headers = new Headers(request.headers);
    if (!headers.get("origin")) {
      headers.set("origin", appUrl);
    }

    // Create a new request with the Origin header for Better Auth
    const modifiedRequest = new Request(`${appUrl}/api/auth/sign-out`, {
      method: "POST",
      headers,
      body: "{}",
    });

    // Pass to Better Auth handler to clear the session
    const authResponse = await auth.handler(modifiedRequest);

    // Check if sign-out was successful
    if (authResponse.ok) {
      // Create custom response with personalized message
      const response = NextResponse.json(
        {
          success: true,
          message: `${userName} logged out successfully`,
        },
        { status: 200 },
      );

      // Forward the Set-Cookie headers to clear session cookies
      const setCookieHeader = authResponse.headers.get("set-cookie");
      if (setCookieHeader) {
        response.headers.set("set-cookie", setCookieHeader);
      }

      return response;
    }

    return authResponse;
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", errors: null },
      { status: 500 },
    );
  }
}
