import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ArrowLeft } from 'lucide-react'

// Adjust import for TextArea
import { TextArea as CustomTextArea } from '../components/ui/TextArea'
import { generateProfileEmbedding } from '../api'

export function EditProfilePage() {
  const { appUser, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bgImageUrl, setBgImageUrl] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setAvatarUrl(profile.avatar_url || '')
      setBgImageUrl(profile.bg_image_url || '')
      
      if ('bio' in profile) {
        setBio(profile.bio || '')
        setLocation(profile.location || '')
        setEmail(profile.email || '')
        setWebsite(profile.website || '')
      }
      
      if ('company_name' in profile) {
        setCompanyName(profile.company_name || '')
        setJobTitle(profile.job_title || '')
        setCompanyWebsite(profile.company_website || '')
      }
    }
  }, [profile])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!appUser) return
    
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (appUser.role === 'student') {
        const { error: updateError } = await supabase
          .from('student_profiles')
          .update({
            full_name: fullName,
            bio: bio,
            location: location,
            avatar_url: avatarUrl,
            bg_image_url: bgImageUrl,
            email: email,
            website: website,
          })
          .eq('user_id', appUser.id)
          
        if (updateError) throw updateError
      } else {
        const { error: updateError } = await supabase
          .from('recruiter_profiles')
          .update({
            full_name: fullName,
            company_name: companyName,
            job_title: jobTitle,
            company_website: companyWebsite,
            avatar_url: avatarUrl,
            bg_image_url: bgImageUrl,
          })
          .eq('user_id', appUser.id)
          
        if (updateError) throw updateError
      }
      
      await refreshProfile()
      generateProfileEmbedding(appUser.id).catch(console.error)
      navigate('/profile')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const isStudent = appUser?.role === 'student'

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/profile')} 
          className="p-2 rounded-full hover:bg-graphite-200/50 text-graphite-600 transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold text-graphite-950">Edit Basic Info</h1>
      </div>

      {error && <div className="bg-error/10 text-error px-4 py-3 rounded-button text-sm">{error}</div>}
      {success && <div className="bg-success/10 text-success px-4 py-3 rounded-button text-sm">{success}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Full Name" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            required 
          />
          <Input 
            label="Profile Picture URL" 
            type="url"
            value={avatarUrl} 
            onChange={e => setAvatarUrl(e.target.value)} 
            placeholder="https://example.com/avatar.jpg"
          />
          <Input 
            label="Background Image URL" 
            type="url"
            value={bgImageUrl} 
            onChange={e => setBgImageUrl(e.target.value)} 
            placeholder="https://example.com/cover.jpg"
          />

          {isStudent ? (
            <>
              <Input 
                label="Email" 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="john@example.com"
              />
              <Input 
                label="Personal Website" 
                type="url"
                value={website} 
                onChange={e => setWebsite(e.target.value)} 
                placeholder="https://johndoe.com"
              />
              <Input 
                label="Location" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="City, Country"
              />
              <CustomTextArea 
                label="Bio" 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </>
          ) : (
            <>
              <Input 
                label="Job Title" 
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
              />
              <Input 
                label="Company Name" 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
              />
              <Input 
                label="Company Website" 
                type="url"
                value={companyWebsite} 
                onChange={e => setCompanyWebsite(e.target.value)} 
                placeholder="https://"
              />
            </>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/profile')}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
