import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  revalidateTag("price-variants");
  revalidatePath("/");
  revalidatePath("/productos");
  return NextResponse.json({ ok: true });
}
