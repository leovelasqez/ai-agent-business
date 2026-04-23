import Link from "next/link";

const SUPPORT_EMAIL = "support@mockforge.ai";

export default function PrivacyPolicyPage() {
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

      <h1 className="text-3xl font-black tracking-tight text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-white/30 mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-sm leading-7">
        <section>
          <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
          <p><strong>Account Information:</strong> When you sign up, we collect your email address and basic profile information provided by your authentication provider (e.g., Google, GitHub).</p>
          <p className="mt-2"><strong>Uploaded Images:</strong> You upload product images to generate mockups. These images are stored securely and used solely to provide the service.</p>
          <p className="mt-2"><strong>Generated Content:</strong> AI-generated mockups are stored in your account history. You control the visibility (public/private) of each generation.</p>
          <p className="mt-2"><strong>Usage Data:</strong> We collect anonymous usage metrics (generation counts, feature usage) to improve the service.</p>
          <p className="mt-2"><strong>Payment Information:</strong> We use Stripe to process payments. MockForge does not store your credit card details — Stripe handles all payment data securely.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide and maintain the MockForge service</li>
            <li>To process credit purchases and manage your account balance</li>
            <li>To generate AI mockups from your uploaded images</li>
            <li>To communicate service updates or respond to support requests</li>
            <li>To prevent abuse and ensure platform security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">3. Image Storage and Retention</h2>
          <p>Uploaded images and generated mockups are stored on secure cloud infrastructure (Supabase Storage). We retain your content for as long as your account is active or as needed to provide the service.</p>
          <p className="mt-2">You may delete individual generations from your history at any time. Upon deletion, images are removed from our storage within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">4. Third-Party Services</h2>
          <p><strong>AI Generation (fal.ai):</strong> Your uploaded images are sent to fal.ai to generate mockups. fal.ai processes images in accordance with their own privacy policy.</p>
          <p className="mt-2"><strong>Payments (Stripe):</strong> Payment processing is handled entirely by Stripe. We do not see or store your full credit card number.</p>
          <p className="mt-2"><strong>Infrastructure (Vercel, Supabase):</strong> Our hosting and database providers process data as necessary to serve the application.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">5. Data Sharing</h2>
          <p>We do not sell your personal information. We share data only with:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Service providers necessary to operate the platform (listed above)</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Object to processing of your data</li>
            <li>Request a copy of your data in a portable format</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#05DF72] hover:underline">{SUPPORT_EMAIL}</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">7. Cookies</h2>
          <p>We use essential cookies to maintain your session and preferences (language selection, onboarding state). We do not use tracking or advertising cookies. See our <Link href="/cookies" className="text-[#05DF72] hover:underline">Cookie Policy</Link> for details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">8. Security</h2>
          <p>We implement reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify users of material changes via email or a notice on the website. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">10. Contact</h2>
          <p>For privacy-related inquiries: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#05DF72] hover:underline">{SUPPORT_EMAIL}</a></p>
        </section>
      </div>
    </>
  );
}
