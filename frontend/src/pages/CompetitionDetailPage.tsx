import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Tabs, type Tab } from '../components/ui/Tabs'
import { Input } from '../components/ui/Input'
import { ArrowLeft, ExternalLink, Users, Trophy, Clock } from 'lucide-react'
import type { Competition } from '../types'

// Extended type for this view
interface LeaderboardEntry {
  id: string
  rank: number
  score: number
  submission: {
    solution_url: string
    user_id?: string
    team_id?: string
    user?: { email: string }
    team?: { team_name: string }
  }
}

export function CompetitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { appUser } = useAuth()

  const [competition, setCompetition] = useState<Competition | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Submission State
  const [solutionUrl, setSolutionUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      try {
        // Fetch competition
        const { data: compData } = await supabase
          .from('competitions')
          .select('*')
          .eq('id', id)
          .single()

        if (compData) {
          setCompetition(compData)
        }

        // Fetch leaderboard
        const { data: lbData } = await supabase
          .from('leaderboard_entries')
          .select(`
            id, rank, score,
            submission:submissions (
              solution_url,
              user_id,
              team_id
            )
          `)
          .eq('competition_id', id)
          .order('rank', { ascending: true })

        if (lbData) {
          // Supabase JS relationships can be tricky, this is a simplified mapping
          setLeaderboard(lbData as unknown as LeaderboardEntry[])
        }
      } catch (error) {
        console.error('Error fetching competition:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  async function handleSubmission(e: FormEvent) {
    e.preventDefault()
    if (!appUser || !competition) return
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          competition_id: competition.id,
          user_id: competition.is_team_based ? null : appUser.id,
          // team_id: ... (Logic to find user's team if team based goes here. For MVP we'll simplify and just allow individual submission if no team UI is fully built yet)
          solution_url: solutionUrl,
        })

      if (error) throw error
      setSubmitSuccess('Solution submitted successfully!')
      setSolutionUrl('')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-graphite-200 border-t-signal-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!competition) {
    return <div className="text-center py-12">Competition not found.</div>
  }

  const isEnded = Boolean(competition.deadline && new Date(competition.deadline) < new Date())
  const isStudent = appUser?.role === 'student'

  const OverviewContent = (
    <div className="flex flex-col gap-6">
      <Card>
        <h3 className="text-lg font-display font-semibold mb-3 text-graphite-950">Description</h3>
        <p className="whitespace-pre-wrap text-sm text-graphite-600 font-body leading-relaxed">
          {competition.description}
        </p>
      </Card>
      <Card>
        <h3 className="text-lg font-display font-semibold mb-3 text-graphite-950">Resources</h3>
        <a 
          href={competition.dataset_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-signal-600 hover:underline font-medium"
        >
          <ExternalLink size={16} />
          Access Dataset
        </a>
      </Card>
    </div>
  )

  const LeaderboardContent = (
    <Card>
      {leaderboard.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-graphite-100 text-graphite-600 border-b border-graphite-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Rank</th>
                <th className="px-4 py-3 font-semibold">Participant</th>
                <th className="px-4 py-3 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.id} className="border-b border-graphite-200 last:border-0 hover:bg-canvas transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-graphite-950">#{entry.rank || '-'}</td>
                  <td className="px-4 py-3 text-graphite-950">
                    {entry.submission.user_id ? 'Individual User' : 'Team'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-signal-600">
                    {entry.score ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-graphite-600">
          No entries on the leaderboard yet.
        </div>
      )}
    </Card>
  )

  const SubmitContent = (
    <Card>
      <h3 className="text-lg font-display font-semibold mb-1 text-graphite-950">Submit Solution</h3>
      <p className="text-sm text-graphite-600 mb-6">
        {competition.is_team_based 
          ? "Ensure your team is fully formed before submitting. Only one submission per team is evaluated."
          : "Submit a link to your public repository or notebook."}
      </p>

      {submitError && <div className="bg-error/10 text-error px-4 py-3 rounded-button text-sm mb-4">{submitError}</div>}
      {submitSuccess && <div className="bg-success/10 text-success px-4 py-3 rounded-button text-sm mb-4">{submitSuccess}</div>}

      <form onSubmit={handleSubmission} className="flex flex-col gap-4 max-w-md">
        <Input 
          label="Solution URL (GitHub / Colab)" 
          type="url"
          value={solutionUrl}
          onChange={(e) => setSolutionUrl(e.target.value)}
          placeholder="https://"
          required
        />
        <Button type="submit" disabled={isSubmitting || isEnded}>
          {isEnded ? 'Competition Ended' : isSubmitting ? 'Submitting...' : 'Submit Link'}
        </Button>
      </form>
    </Card>
  )

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', content: OverviewContent },
    { id: 'leaderboard', label: 'Leaderboard', content: LeaderboardContent },
  ]

  if (isStudent) {
    tabs.push({ id: 'submit', label: 'My Submission', content: SubmitContent })
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/competitions')}
            className="p-2 rounded-full hover:bg-graphite-200/50 text-graphite-600 transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <Badge variant={isEnded ? 'default' : 'success'}>
              {isEnded ? 'Ended' : 'Active'}
            </Badge>
            {competition.is_team_based && (
              <Badge variant="signal" className="flex gap-1 items-center">
                <Users size={12} /> Team Based
              </Badge>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-display font-bold text-graphite-950">{competition.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-graphite-600 font-body border-b border-graphite-200 pb-6">
          {competition.deadline ? (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Deadline: <strong className="text-graphite-950 font-medium">{new Date(competition.deadline).toLocaleString()}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Rolling Deadline</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Trophy size={16} />
            <span>Evaluation: <strong className="text-graphite-950 capitalize font-medium">{competition.scoring_type}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="overview" />

    </div>
  )
}
