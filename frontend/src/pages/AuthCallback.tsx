import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we already have a session (e.g., hash was just parsed)
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message)
      } else if (session) {
        navigate('/dashboard', { replace: true })
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      }
    })

    // Handle hash fragment errors (e.g., from OAuth providers)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const errorDescription = hashParams.get('error_description')
    if (errorDescription) {
      setError(decodeURIComponent(errorDescription))
    }

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="bg-surface border border-graphite-200 rounded-card p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-xl font-display font-semibold text-graphite-950 mb-2">
            Authentication Error
          </h1>
          <p className="text-sm text-graphite-600 font-body mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center font-body font-semibold rounded-button bg-signal-600 text-white hover:bg-signal-600/90 active:bg-signal-600/80 text-sm px-4 py-2 w-full"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-graphite-200 border-t-signal-600 rounded-full animate-spin"></div>
        <p className="text-sm text-graphite-600 font-body animate-pulse">
          Completing sign in...
        </p>
      </div>
    </div>
  )
}
