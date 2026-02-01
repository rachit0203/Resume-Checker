import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-browser";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page
  return NextResponse.redirect(new URL("/", request.url));
}
