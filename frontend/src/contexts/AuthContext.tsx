import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AppUser, StudentProfile, RecruiterProfile } from '../types'

type Profile = StudentProfile | RecruiterProfile

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  profile: Profile | null
  isLoading: boolean
  signUp: (email: string, password: string, role: string, fullName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch from public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) {
        console.error('Error fetching user:', userError)
        return
      }
      if (!userData) return

      setAppUser(userData as AppUser)

      // Fetch role-specific profile
      if (userData.role === 'recruiter') {
        const { data: profileData, error: profileError } = await supabase
          .from('recruiter_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
          
        if (profileError) console.error('Error fetching recruiter profile:', profileError)
        if (profileData) setProfile(profileData as RecruiterProfile)
        
      } else {
        const { data: profileData, error: profileError } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()
          
        if (profileError) console.error('Error fetching student profile:', profileError)
        if (profileData) setProfile(profileData as StudentProfile)
      }
    } catch (err) {
      console.error('Unexpected error in fetchUserData:', err)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    // Listen for auth state changes (this automatically fires on initial load too!)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserData(session.user.id).finally(() => {
          if (isMounted) setIsLoading(false)
        })
      } else {
        setAppUser(null)
        setProfile(null)
        setIsLoading(false) // Make sure to clear loading state if no user
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserData])

  async function signUp(email: string, password: string, role: string, fullName: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName },
      },
    })
    if (error) throw error
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signInWithOAuth(provider: 'google' | 'github') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setAppUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (user) {
      await fetchUserData(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        profile,
        isLoading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
