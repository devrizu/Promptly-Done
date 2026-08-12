// ============================================================
// Skillify — TypeScript types matching DATABASE_SCHEMA.md
// ============================================================

export interface AppUser {
  id: string
  email: string
  role: 'student' | 'recruiter' | 'admin' | 'unassigned'
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  full_name: string
  bio: string
  location: string
  avatar_url: string
  resume_url: string
  email: string | null
  website: string | null
  bg_image_url: string | null
  created_at: string
  updated_at: string
}

export interface RecruiterProfile {
  id: string
  user_id: string
  full_name: string
  company_name: string
  company_website: string
  job_title: string
  avatar_url: string
  bg_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
}

export interface UserSkill {
  id: string
  user_id: string
  skill_id: string
  self_rated_level: 'beginner' | 'intermediate' | 'advanced' | null
}

export interface UserSkillWithSkill extends UserSkill {
  skill: Skill
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  github_url: string
  demo_url: string
  is_github_verified?: boolean
  created_at: string
  updated_at: string
}

export interface Competition {
  id: string
  created_by: string
  title: string
  description: string
  dataset_url: string
  deadline: string | null
  is_team_based: boolean
  scoring_type: 'manual' | 'computed'
  created_at: string
  updated_at: string
}

export interface JobPosting {
  id: string
  recruiter_id: string
  title: string
  description: string
  location: string
  employment_type: 'full-time' | 'internship' | 'contract'
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
}
