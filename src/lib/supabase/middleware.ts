import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin/allowlist";

function withSecureCookies<T extends Record<string, unknown>>(options: T): T {
  return {
    ...options,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function updateSupabaseSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  let response = NextResponse.next({ request });

  if (!url || !key) {
    if (isAdminPage && !isLoginPage) {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.searchParams.set("setup", "1");
      return NextResponse.redirect(login);
    }
    if (isAdminApi && !isLoginApi) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, withSecureCookies(options));
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminUser = user && isAdminEmail(user.email) ? user : null;

  if (user && !adminUser && !isLoginApi) {
    await supabase.auth.signOut();
  }

  if (isLoginApi) {
    return response;
  }

  if (isAdminApi && !adminUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (isAdminPage && !isLoginPage && !adminUser) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = "";
    return NextResponse.redirect(login);
  }

  if (isLoginPage && adminUser) {
    const admin = request.nextUrl.clone();
    admin.pathname = "/admin";
    admin.search = "";
    return NextResponse.redirect(admin);
  }

  return response;
}
