import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type GuardState = { fails: number; windowStart: number; lockedUntil: number };

const memory = new Map<string, GuardState>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function loginGuardKey(ip: string): string {
  const salt = process.env.NEXT_PUBLIC_SUPABASE_URL || "maldivas-outdoor";
  return createHash("sha256").update(`login-ip:${ip}:${salt}`).digest("hex");
}

function memoryStatus(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const state = memory.get(key);
  if (!state) return { allowed: true, retryAfter: 0 };
  if (state.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((state.lockedUntil - now) / 1000) };
  }
  if (now - state.windowStart > WINDOW_MS) {
    memory.delete(key);
    return { allowed: true, retryAfter: 0 };
  }
  return { allowed: true, retryAfter: 0 };
}

function memoryFail(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const current = memory.get(key);
  if (!current || now - current.windowStart > WINDOW_MS) {
    const next = { fails: 1, windowStart: now, lockedUntil: 0 };
    memory.set(key, next);
    return { allowed: true, retryAfter: 0 };
  }
  const fails = current.fails + 1;
  const lockedUntil = fails >= MAX_FAILS ? now + WINDOW_MS : 0;
  memory.set(key, { ...current, fails, lockedUntil });
  if (lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil(WINDOW_MS / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function memoryOk(key: string) {
  memory.delete(key);
}

async function rpcStatus(key: string): Promise<{ allowed: boolean; retryAfter: number } | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("login_guard_status", { p_key: key });
  if (error || !data) return null;
  const payload = data as { allowed?: boolean; retry_after?: number };
  return {
    allowed: payload.allowed !== false,
    retryAfter: Number(payload.retry_after ?? 0),
  };
}

async function rpcFail(key: string): Promise<{ allowed: boolean; retryAfter: number } | null> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("login_guard_fail", { p_key: key });
  if (error || !data) return null;
  const payload = data as { allowed?: boolean; retry_after?: number };
  return {
    allowed: payload.allowed !== false,
    retryAfter: Number(payload.retry_after ?? 0),
  };
}

async function rpcOk(key: string): Promise<void> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return;
  await supabase.rpc("login_guard_ok", { p_key: key });
}

export async function checkLoginAllowed(ip: string): Promise<{ allowed: boolean; retryAfter: number }> {
  const key = loginGuardKey(ip);
  const local = memoryStatus(key);
  if (!local.allowed) return local;
  const remote = await rpcStatus(key);
  return remote ?? local;
}

export async function registerLoginFailure(ip: string): Promise<{ allowed: boolean; retryAfter: number }> {
  const key = loginGuardKey(ip);
  const local = memoryFail(key);
  const remote = await rpcFail(key);
  if (remote && !remote.allowed) return remote;
  return local;
}

export async function registerLoginSuccess(ip: string): Promise<void> {
  const key = loginGuardKey(ip);
  memoryOk(key);
  await rpcOk(key);
}

export async function delayFailedLogin(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 550));
}
