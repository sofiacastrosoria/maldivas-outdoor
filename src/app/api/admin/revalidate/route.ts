import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/requireAdmin";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  revalidateTag("price-variants");
  revalidateTag("store-discounts");
  revalidateTag("store-catalog");
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath("/admin/descuentos");
  revalidatePath("/admin/productos");
  return NextResponse.json({ ok: true });
}
