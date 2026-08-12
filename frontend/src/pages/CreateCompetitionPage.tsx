import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ArrowLeft } from 'lucide-react'

// Correcting TextArea import to point to its dedicated file (similar to EditProfilePage)
import { TextArea as CustomTextArea } from '../components/ui/TextArea'

export function CreateCompetitionPage() {
  const { appUser } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [datasetUrl, setDatasetUrl] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isTeamBased, setIsTeamBased] = useState(false)
  const [scoringType, setScoringType] = useState<'manual' | 'computed'>('manual')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (appUser?.role === 'student') {
    return (
      <div className="text-center py-12 text-error">
        Unauthorized: Only recruiters and admins can create competitions.
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!appUser) return

    setIsLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('competitions')
        .insert({
          created_by: appUser.id,
          title,
          description,
          dataset_url: datasetUrl,
          deadline: deadline ? new Date(deadline).toISOString() : null,
          is_team_based: isTeamBased,
          scoring_type: scoringType,
        })

      if (insertError) throw insertError

      navigate('/competitions')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create competition')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/competitions')}
          className="p-2 rounded-full hover:bg-graphite-200/50 text-graphite-600 transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold text-graphite-950">Host Competition</h1>
      </div>

      {error && <div className="bg-error/10 text-error px-4 py-3 rounded-button text-sm">{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Competition Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Q3 Churn Prediction Challenge"
            required
          />

          <CustomTextArea
            label="Description & Rules"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem, the data, and how submissions will be evaluated..."
            required
            rows={5}
          />

          <Input
            label="Dataset URL"
            type="url"
            value={datasetUrl}
            onChange={(e) => setDatasetUrl(e.target.value)}
            placeholder="https:// (Link to public dataset or description)"
            required
          />

          <Input
            label="Deadline (Optional)"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="flex flex-col gap-4 pt-4 border-t border-graphite-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-graphite-600">Settings</h3>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTeamBased}
                onChange={(e) => setIsTeamBased(e.target.checked)}
                className="w-4 h-4 rounded border-graphite-400 text-signal-600 focus:ring-signal-400/30 cursor-pointer"
              />
              <span className="text-sm text-graphite-950">Team-based competition</span>
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-graphite-600 font-body">
                Scoring Type
              </span>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="scoring"
                    value="manual"
                    checked={scoringType === 'manual'}
                    onChange={() => setScoringType('manual')}
                    className="cursor-pointer"
                  />
                  Manual Review
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="scoring"
                    value="computed"
                    checked={scoringType === 'computed'}
                    onChange={() => setScoringType('computed')}
                    className="cursor-pointer"
                  />
                  Computed (e.g., RMSE)
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-graphite-200">
            <Button variant="secondary" type="button" onClick={() => navigate('/competitions')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Publishing...' : 'Publish Competition'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
