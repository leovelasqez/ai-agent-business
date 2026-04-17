import Stripe from "stripe";
import { NextResponse } from "next/server";

const PACKAGES = {
  single: { envKey: "STRIPE_PRICE_SINGLE_PACK", label: "MockForge · Single Pack" },
  bundle: { envKey: "STRIPE_PRICE_BUNDLE",      label: "MockForge · 3-Pack Bundle" },
} as const;

type PackageKey = keyof typeof PACKAGES;

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { ok: false, error: "PAYMENTS_NOT_CONFIGURED", message: "Payments are not enabled on this server." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { generationId, package: pkg } = body as {
    generationId?: string;
    package?: string;
  };

  const packageKey: PackageKey = pkg === "bundle" ? "bundle" : "single";
  const priceId = process.env[PACKAGES[packageKey].envKey];
  if (!priceId) {
    return NextResponse.json(
      { ok: false, error: "PRICE_NOT_CONFIGURED", message: "This package is not configured yet." },
      { status: 503 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: generationId
        ? `${appUrl}/results?generationId=${generationId}`
        : `${appUrl}/results`,
      metadata: {
        generationId: generationId ?? "",
        package: packageKey,
      },
    });

    return NextResponse.json({
      ok: true,
      data: { checkoutUrl: session.url },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe error";
    console.error("[checkout] Stripe session creation failed:", message);
    return NextResponse.json(
      { ok: false, error: "CHECKOUT_FAILED", message: "Could not create checkout session. Try again." },
      { status: 500 },
    );
  }
}
