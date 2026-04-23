import Link from "next/link";

export default function CookiePolicyPage() {
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

      <h1 className="text-3xl font-black tracking-tight text-white mb-2">Cookie Policy</h1>
      <p className="text-sm text-white/30 mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-sm leading-7">
        <section>
          <h2 className="text-lg font-bold text-white mb-3">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Cookies We Use</h2>
          <p>MockForge uses only essential cookies. We do <strong>not</strong> use advertising, tracking, or analytics cookies.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="pb-2 pr-4 font-semibold">Cookie</th>
                  <th className="pb-2 pr-4 font-semibold">Purpose</th>
                  <th className="pb-2 pr-4 font-semibold">Duration</th>
                  <th className="pb-2 font-semibold">Category</th>
                </tr>
              </thead>
              <tbody className="text-white/60">
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono text-white/40">session</td>
                  <td className="py-2 pr-4">Maintains your anonymous session for credit tracking and rate limiting</td>
                  <td className="py-2 pr-4">1 year</td>
                  <td className="py-2">Essential</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono text-white/40">mockforge-lang</td>
                  <td className="py-2 pr-4">Stores your language preference</td>
                  <td className="py-2 pr-4">1 year</td>
                  <td className="py-2">Essential</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4 font-mono text-white/40">mockforge-tour-done</td>
                  <td className="py-2 pr-4">Remembers that you completed the onboarding tour</td>
                  <td className="py-2 pr-4">1 year</td>
                  <td className="py-2">Essential</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Third-Party Cookies</h2>
          <p>When you purchase credits, you may be redirected to Stripe for payment processing. Stripe may set its own cookies as part of the checkout experience. These are governed by Stripe&apos;s own cookie policy.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Managing Cookies</h2>
          <p>All cookies used by MockForge are essential for the service to function. If you disable cookies in your browser, the service may not work correctly. You can manage cookie settings through your browser preferences.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Changes</h2>
          <p>We may update this Cookie Policy if our cookie usage changes. Any updates will be reflected on this page with a revised &quot;Last updated&quot; date.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
          <p>Questions about our cookie practices: <a href="mailto:support@mockforge.ai" className="text-[#05DF72] hover:underline">support@mockforge.ai</a></p>
        </section>
      </div>
    </>
  );
}
