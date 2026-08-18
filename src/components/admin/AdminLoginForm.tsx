"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setup = params.get("setup") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!configured) {
      setError("El panel no está disponible en este momento.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "No se pudo iniciar sesión. Verificá email y contraseña.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/40">
        Maldivas Outdoor
      </p>
      <h1 className="mt-3 text-3xl font-extralight tracking-tight">
        Administración
      </h1>
      <p className="mt-3 text-sm font-light text-matte-black/55">
        Acceso restringido.
      </p>

      {setup && (
        <p className="mt-6 border border-stone/20 bg-white px-4 py-3 text-sm font-light text-matte-black/70">
          El panel todavía no está configurado. Revisá las variables de entorno del sitio.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-4" autoComplete="on">
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] uppercase text-matte-black/40">
            Email
          </span>
          <input
            type="email"
            autoComplete="username"
            required
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-premium-border bg-white px-3.5 py-3 text-sm outline-none focus:border-matte-black"
          />
        </label>
        <label className="block">
          <span className="text-[10px] tracking-[0.2em] uppercase text-matte-black/40">
            Contraseña
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            maxLength={200}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-premium-border bg-white px-3.5 py-3 text-sm outline-none focus:border-matte-black"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-matte-black py-3.5 text-xs uppercase tracking-[0.2em] text-white disabled:opacity-40"
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
