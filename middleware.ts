import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get("user_id")?.value;

  // ✅ Define route groups
  const protectedRoutes = ["/forgot-password"];
  const publicRoutes = ["/login", "/register",  "/", "/avatar-creation", "/chat"];

  const isProtected = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );
  const isPublic = publicRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // 🔒 Block unauthenticated access to protected routes
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Prevent authenticated users from visiting public routes
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to all relevant paths
export const config = {
  matcher: [
    "/chat/:path*",
    "/avatar-creation/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
