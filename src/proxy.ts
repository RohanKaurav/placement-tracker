import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  console.log("Middleware token:", token);
  if (!token) {
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/leaderboard') || req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (next-auth internal routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - The landing page (root /)
     */
    "/((?!$|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};