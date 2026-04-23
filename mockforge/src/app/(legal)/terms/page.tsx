import Link from "next/link";

const SUPPORT_EMAIL = "support@mockforge.ai";

export default function TermsOfServicePage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/35 transition hover:bg-white/5 hover:text-white/70 mb-10"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 11L5 7l4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <h1 className="text-3xl font-black tracking-tight text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-white/30 mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-sm leading-7">
        <section>
          <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>By using MockForge (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
          <p>MockForge is an AI-powered tool that generates product mockups from uploaded images. The Service uses third-party AI models to transform your product photos into professional mockup images in various styles and formats.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">3. Credits and Payments</h2>
          <p><strong>Credit System:</strong> MockForge operates on a credit-based system. Each generation type has a defined credit cost. Credits are deducted when a generation is submitted.</p>
          <p className="mt-2"><strong>Free Trial:</strong> New users receive a limited number of free credits. These credits have no monetary value and cannot be refunded.</p>
          <p className="mt-2"><strong>Purchases:</strong> Credit packs can be purchased via Stripe. All prices are listed in the applicable currency at the time of purchase. Credits are non-transferable.</p>
          <p className="mt-2"><strong>Failed Generations:</strong> If a generation fails due to a provider or system error, credits are automatically refunded to your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">4. Refund Policy</h2>
          <p>Credit pack purchases are eligible for a full refund within 14 days of purchase, provided that fewer than 50% of the purchased credits have been used. To request a refund, contact <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#05DF72] hover:underline">{SUPPORT_EMAIL}</a>.</p>
          <p className="mt-2">Credits consumed by successful generations are non-refundable. Automatic refunds for failed generations are processed immediately.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">5. User Content</h2>
          <p><strong>Your Images:</strong> You retain ownership of images you upload to the Service. By uploading, you grant MockForge permission to process them through AI models to generate mockups.</p>
          <p className="mt-2"><strong>Generated Content:</strong> AI-generated mockups are provided to you for your use. You are responsible for ensuring that generated content complies with applicable laws and does not infringe on third-party rights.</p>
          <p className="mt-2"><strong>Public Gallery:</strong> You may choose to make generations visible in the public gallery. You can toggle visibility at any time from your history.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">6. Acceptable Use</h2>
          <p>You agree not to use MockForge to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Generate content that is illegal, harmful, threatening, or abusive</li>
            <li>Upload images you do not have the right to use</li>
            <li>Attempt to reverse-engineer, decompile, or gain unauthorized access to the Service</li>
            <li>Resell or redistribute credits or access to the Service without authorization</li>
            <li>Use automated systems to abuse rate limits or API access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">7. Intellectual Property</h2>
          <p>The MockForge brand, website design, and underlying software are the intellectual property of MockForge. AI-generated outputs are provided for your use, but we make no claims about their copyright status — this may depend on applicable AI copyright laws in your jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">8. Service Availability</h2>
          <p>We strive to maintain high availability but do not guarantee uninterrupted service. Scheduled maintenance, provider outages, or force majeure events may cause temporary downtime. We will make reasonable efforts to notify users of planned maintenance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">9. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, MockForge is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          <p className="mt-2">Our total liability shall not exceed the amount you paid for credits in the 90 days preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">10. Account Termination</h2>
          <p>We may suspend or terminate your account for violation of these terms. Upon termination, your data will be deleted within 30 days. You may also delete your account at any time by contacting support.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">11. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Material changes will be communicated via email or a notice on the website. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">12. Contact</h2>
          <p>For questions about these Terms: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#05DF72] hover:underline">{SUPPORT_EMAIL}</a></p>
        </section>
      </div>
    </>
  );
}
