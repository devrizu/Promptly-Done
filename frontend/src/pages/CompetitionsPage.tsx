import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Trophy, Clock, Users, Plus } from 'lucide-react'
import type { Competition } from '../types'

export function CompetitionsPage() {
  const { appUser } = useAuth()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const { data } = await supabase
          .from('competitions')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) {
          setCompetitions(data)
        }
      } catch (error) {
        console.error('Error fetching competitions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  const isRecruiter = appUser?.role === 'recruiter' || appUser?.role === 'admin'

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-graphite-200 border-t-signal-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-graphite-950">Competitions</h1>
          <p className="text-sm text-graphite-600 font-body">
            Prove your skills in real-world scenarios. Build your verified portfolio.
          </p>
        </div>
        {isRecruiter && (
          <Link to="/competitions/new">
            <Button>
              <Plus size={16} />
              Host Competition
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.length > 0 ? (
          competitions.map((comp) => {
            const isEnded = Boolean(comp.deadline && new Date(comp.deadline) < new Date())
            
            return (
              <Card key={comp.id} hover className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={isEnded ? 'default' : 'success'}>
                    {isEnded ? 'Ended' : 'Active'}
                  </Badge>
                  {comp.is_team_based && (
                    <Badge variant="signal" className="flex gap-1 items-center">
                      <Users size={12} /> Team
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-lg font-display font-semibold text-graphite-950 mb-2 leading-tight">
                  {comp.title}
                </h3>
                
                <p className="text-sm text-graphite-600 font-body line-clamp-3 mb-4 flex-1">
                  {comp.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-graphite-600 font-body mb-4 pt-4 border-t border-graphite-200">
                  {comp.deadline ? (
                    <div className="flex items-center gap-1.5" title="Deadline">
                      <Clock size={14} />
                      {new Date(comp.deadline).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5" title="Rolling">
                      <Clock size={14} />
                      Rolling
                    </div>
                  )}
                  <div className="flex items-center gap-1.5" title="Scoring Type">
                    <Trophy size={14} />
                    <span className="capitalize">{comp.scoring_type} Score</span>
                  </div>
                </div>

                <Link to={`/competitions/${comp.id}`} className="block w-full">
                  <Button variant="secondary" fullWidth>View Details</Button>
                </Link>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center text-graphite-600">
            No competitions have been published yet.
          </div>
        )}
      </div>
    </div>
  )
}
