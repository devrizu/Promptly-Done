import { Link } from 'react-router-dom'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas text-graphite-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-signal-600 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-graphite max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, update your profile, 
              participate in competitions, or communicate with other users. This includes your name, email address, 
              skills, professional background, and any direct messages sent through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate our platform, match candidates with jobs, 
              facilitate communication between recruiters and candidates, and send you push notifications 
              when you receive new messages or updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
            <p>
              We use Supabase for authentication and database hosting. We also use Apple and Google push 
              notification services to deliver real-time notifications to your browser. These services 
              may collect your IP address and device information necessary for their functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, 
              no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
