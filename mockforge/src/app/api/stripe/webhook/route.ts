import Stripe from "stripe";
import { NextResponse } from "next/server";

// Stripe requires the raw request body for signature verification.
// In Next.js App Router, request.text() provides it before any parsing.
export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[stripe/webhook] invalid signature:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { generationId, package: pkg } = session.metadata ?? {};
    console.log("[stripe/webhook] checkout.session.completed", {
      sessionId: session.id,
      generationId,
      package: pkg,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
    // TODO: Mark generation as paid in DB once payment_status column is added.
  }

  return NextResponse.json({ received: true });
}
