import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
        404
      </p>
      <h1 className="text-3xl font-extralight mb-8">Página no encontrada</h1>
      <Link
        href="/"
        className="text-xs tracking-luxury uppercase border border-matte-black px-8 py-3 hover:bg-matte-black hover:text-white transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
