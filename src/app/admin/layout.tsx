import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-matte-black">{children}</div>
  );
}
