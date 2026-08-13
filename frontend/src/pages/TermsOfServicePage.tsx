import { Link } from 'react-router-dom'

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-canvas text-graphite-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-signal-600 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-graphite max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using TrueSkills, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. User Accounts</h2>
            <p>
              You are responsible for safeguarding the password that you use to access the service 
              and for any activities or actions under your password. You agree not to disclose your 
              password to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Acceptable Use</h2>
            <p>
              You agree not to use the platform to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Harass, abuse, or harm another person</li>
              <li>Send spam or unsolicited messages to candidates or recruiters</li>
              <li>Impersonate or misrepresent your affiliation with any person or entity</li>
              <li>Violate any applicable law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
