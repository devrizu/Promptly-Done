import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function OnboardingPage() {
  const { user, appUser, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // If they aren't unassigned, they don't belong here
  if (appUser && appUser.role !== 'unassigned') {
    navigate('/dashboard', { replace: true })
    return null
  }

  async function handleSelectRole(role: 'student' | 'recruiter') {
    if (!user) return
    setIsSubmitting(true)
    setError('')

    try {
      // 1. Update the user role
      const { error: roleError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', user.id)

      if (roleError) throw roleError

      // 2. Create the corresponding profile row
      // We'll extract full name from Google metadata if it exists
      const metadata = user.user_metadata || {}
      const fullName = metadata.full_name || metadata.name || ''

      if (role === 'student') {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({
            user_id: user.id,
            full_name: fullName
          })
        if (profileError) throw profileError
      } else {
        const { error: profileError } = await supabase
          .from('recruiter_profiles')
          .insert({
            user_id: user.id,
            full_name: fullName
          })
        if (profileError) throw profileError
      }

      // 3. Refresh context and redirect
      await refreshProfile()
      navigate('/dashboard', { replace: true })
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update role.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="bg-surface border border-graphite-200 rounded-card p-8 max-w-2xl w-full text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Skillify Logo" className="h-12" />
        </div>
        <h1 className="text-3xl font-display font-bold text-graphite-950 mb-4">
          Welcome to Skillify!
        </h1>
        <p className="text-graphite-600 font-body mb-8">
          To get started, please tell us how you'll be using the platform.
        </p>

        {error && (
          <div className="mb-6 bg-error/10 text-error px-4 py-3 rounded-button text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <button
            onClick={() => handleSelectRole('student')}
            disabled={isSubmitting}
            className="flex flex-col items-center p-6 border-2 border-graphite-200 rounded-xl hover:border-signal-500 hover:bg-signal-50 transition-all text-left group disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="w-16 h-16 bg-signal-100 text-signal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h2 className="text-xl font-display font-semibold text-graphite-950 mb-2">I am a Candidate</h2>
            <p className="text-sm text-graphite-600 text-center">
              Build your AI-verified profile, compete in challenges, and apply to top tech jobs.
            </p>
          </button>

          {/* Recruiter Card */}
          <button
            onClick={() => handleSelectRole('recruiter')}
            disabled={isSubmitting}
            className="flex flex-col items-center p-6 border-2 border-graphite-200 rounded-xl hover:border-accent-500 hover:bg-accent-50 transition-all text-left group disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className="text-xl font-display font-semibold text-graphite-950 mb-2">I am a Recruiter</h2>
            <p className="text-sm text-graphite-600 text-center">
              Post jobs, run competitions, and use AI to discover the best talent.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
