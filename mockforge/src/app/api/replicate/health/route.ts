import { NextResponse } from "next/server";
import { isAuthorizedSecret } from "@/lib/admin-auth";

export async function GET(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    !isAuthorizedSecret(request, process.env.PROVIDER_HEALTH_SECRET, "x-provider-health-secret")
  ) {
    return NextResponse.json({ ok: true, provider: "replicate" });
  }

  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.REPLICATE_API_TOKEN),
    provider: "replicate",
  });
}
