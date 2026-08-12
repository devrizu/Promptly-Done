import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Code, Pencil, Trash2, ShieldCheck } from 'lucide-react'
import { Card } from './Card'
import { SkillPill } from './SkillPill'
import type { Project, Skill } from '../../types'

interface ProjectCardProps {
  project: Project
  skills?: Skill[]
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
}

export function ProjectCard({ project, skills = [], onEdit, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card hover className="relative group" onClick={() => setIsExpanded(!isExpanded)}>
      {/* Action buttons (only shown on hover if handlers provided) */}
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-1.5 rounded-full bg-graphite-100 text-graphite-600 hover:text-signal-600 hover:bg-signal-50 transition-colors cursor-pointer border-none"
              title="Edit Project"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project); }}
              className="p-1.5 rounded-full bg-graphite-100 text-graphite-600 hover:text-error hover:bg-error/10 transition-colors cursor-pointer border-none"
              title="Delete Project"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold font-body text-graphite-950 leading-snug pr-16 flex items-center gap-2">
          {project.title}
        </h3>
        {project.description && (
          <motion.p
            layout
            className={`text-sm text-graphite-600 font-body ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {project.description}
          </motion.p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <SkillPill key={skill.id} name={skill.name} size="sm" />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-graphite-600 hover:text-signal-600 transition-colors no-underline"
              >
                <Code size={14} />
                Source
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-graphite-600 hover:text-signal-600 transition-colors no-underline"
              >
                <ExternalLink size={14} />
                Demo
              </a>
            )}
          </div>
          
          {project.is_github_verified && (
            <div className="flex items-center gap-1 text-signal-600">
              <ShieldCheck size={16} />
              <span className="text-xs font-semibold">GitHub Verified</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

