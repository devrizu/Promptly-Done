import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { TextArea } from '../components/ui/TextArea'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { screenBias } from '../api'

export function CreateJobPage() {
  const { appUser } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('full-time')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [isCheckingBias, setIsCheckingBias] = useState(false)
  const [biasResult, setBiasResult] = useState<any>(null)

  if (appUser?.role === 'student') {
    return (
      <div className="text-center py-12 text-error">
        Unauthorized: Only recruiters can post jobs.
      </div>
    )
  }

  async function handleCheckBias() {
    if (!description.trim()) {
      setError('Please enter a job description to analyze.')
      return
    }
    
    setIsCheckingBias(true)
    setError('')
    setBiasResult(null)
    
    try {
      const res = await screenBias(description)
      setBiasResult(res)
    } catch (err: any) {
      setError(err.message || 'Failed to check bias.')
    } finally {
      setIsCheckingBias(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!appUser) return

    setIsLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('job_postings')
        .insert({
          recruiter_id: appUser.id,
          title,
          description,
          location,
          employment_type: employmentType,
          status: 'open'
        })

      if (insertError) throw insertError

      navigate('/jobs')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to post job')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/jobs')}
          className="p-2 rounded-full hover:bg-graphite-200/50 text-graphite-600 transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold text-graphite-950">Post a Job</h1>
      </div>

      {error && <div className="bg-error/10 text-error px-4 py-3 rounded-button text-sm">{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Data Scientist"
            required
          />

          <div className="relative">
            <TextArea
              label="Job Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              required
              rows={8}
            />
            <div className="absolute top-0 right-0">
              <button 
                type="button" 
                onClick={handleCheckBias}
                disabled={isCheckingBias || !description}
                className="text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider text-accent-600 bg-accent-50 hover:bg-accent-100 py-1 px-2.5 rounded-full border border-accent-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={12} />
                {isCheckingBias ? 'Analyzing...' : 'AI Bias Check'}
              </button>
            </div>
          </div>
          
          {biasResult && (
            <div className={`p-4 rounded-lg border text-sm ${biasResult.has_bias ? 'bg-warning-50 border-warning-200 text-warning-900' : 'bg-success-50 border-success-200 text-success-900'}`}>
              <h4 className="font-bold flex items-center gap-2 mb-2">
                {biasResult.has_bias ? '⚠️ Potential Bias Detected' : '✅ Looks Good!'}
              </h4>
              {biasResult.has_bias && biasResult.issues && (
                <div className="space-y-3 mt-3">
                  <div>
                    <span className="font-semibold block mb-1">Flagged Phrases:</span>
                    <ul className="list-disc pl-5 opacity-90 space-y-1">
                      {biasResult.issues.map((issue: string, idx: number) => <li key={idx}>{issue}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold block mb-1">Suggestions:</span>
                    <ul className="list-disc pl-5 opacity-90 space-y-1">
                      {biasResult.suggestions.map((sug: string, idx: number) => <li key={idx}>{sug}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              {!biasResult.has_bias && (
                <p>We didn't detect any obvious exclusionary or biased language in this description.</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA (or Remote)"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-graphite-600 font-body">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="h-10 px-3 bg-white border border-graphite-200 rounded-button text-sm text-graphite-950 focus:outline-none focus:ring-2 focus:ring-signal-400 focus:border-transparent transition-all font-body"
              >
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-graphite-200">
            <Button variant="secondary" type="button" onClick={() => navigate('/jobs')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
