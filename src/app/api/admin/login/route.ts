import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/admin/allowlist";
import {
  checkLoginAllowed,
  delayFailedLogin,
  getClientIp,
  registerLoginFailure,
  registerLoginSuccess,
} from "@/lib/admin/loginGuard";

function cookieOptions<T extends Record<string, unknown>>(options: T): T {
  return {
    ...options,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const guard = await checkLoginAllowed(ip);
  if (!guard.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Probá de nuevo más tarde." },
      { status: 429, headers: { "Retry-After": String(Math.max(1, guard.retryAfter)) } }
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? "").trim();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!email || !password || password.length > 200 || email.length > 120) {
    await delayFailedLogin();
    await registerLoginFailure(ip);
    return NextResponse.json(
      { error: "No se pudo iniciar sesión. Verificá email y contraseña." },
      { status: 401 }
    );
  }

  if (!isAdminEmail(email)) {
    await delayFailedLogin();
    const failed = await registerLoginFailure(ip);
    if (!failed.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Probá de nuevo más tarde." },
        { status: 429, headers: { "Retry-After": String(Math.max(1, failed.retryAfter)) } }
      );
    }
    return NextResponse.json(
      { error: "No se pudo iniciar sesión. Verificá email y contraseña." },
      { status: 401 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Servicio no disponible." }, { status: 503 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, cookieOptions(options));
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user || !isAdminEmail(data.user.email)) {
    if (data.user && !isAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
    }
    await delayFailedLogin();
    const failed = await registerLoginFailure(ip);
    if (!failed.allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Probá de nuevo más tarde." },
        { status: 429, headers: { "Retry-After": String(Math.max(1, failed.retryAfter)) } }
      );
    }
    return NextResponse.json(
      { error: "No se pudo iniciar sesión. Verificá email y contraseña." },
      { status: 401 }
    );
  }

  await registerLoginSuccess(ip);
  return NextResponse.json({ ok: true });
}
