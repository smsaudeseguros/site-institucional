import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow public access to login and forgot-password pages
    if (
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/admin/forgot-password" ||
      request.nextUrl.pathname === "/admin/update-password"
    ) {
        // If user is already logged in and trying to access login page, redirect to admin dashboard
        if (user && request.nextUrl.pathname === "/admin/login") {
             return NextResponse.redirect(new URL("/admin", request.url));
        }
        // Force password change check
        if (user && user.user_metadata?.force_password_change && request.nextUrl.pathname !== "/admin/update-password") {
            return NextResponse.redirect(new URL("/admin/update-password", request.url));
        }
        return response;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check for forced password change on any other admin route
    if (user.user_metadata?.force_password_change) {
         return NextResponse.redirect(new URL("/admin/update-password", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
