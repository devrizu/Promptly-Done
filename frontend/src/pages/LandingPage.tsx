import { motion, type Variants } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { Sparkles, CheckCircle, ShieldCheck, Trophy, Search, ChevronRight } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <PageTransition className="min-h-screen bg-canvas overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-graphite-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TrueSkills Logo" className="h-8" />
            <span className="text-xl font-logo font-bold text-graphite-950">TrueSkills</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-graphite-600 hover:text-graphite-950 transition-colors hidden sm:block">
              Log in
            </Link>
            <Button size="sm" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-signal-100 rounded-full blur-[100px] opacity-60 mix-blend-multiply pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute top-40 left-0 -z-10 w-[500px] h-[500px] bg-ai-100 rounded-full blur-[100px] opacity-60 mix-blend-multiply pointer-events-none transform -translate-x-1/3" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-signal-100/50 border border-signal-200 text-signal-700 text-sm font-semibold mb-6">
              <Sparkles size={14} />
              <span>The New Standard in Hiring</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-display font-bold text-graphite-950 leading-tight mb-6">
              Hire the Top 1%, <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-600 to-signal-600">Verified by AI.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-graphite-600 font-body mb-8 max-w-2xl mx-auto lg:mx-0">
              TrueSkills connects top tech talent with forward-thinking companies. 
              We use AI to verify skills, analyze GitHub activity, and uncover your true potential.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto shadow-xl shadow-signal-600/20 group">
                Start Hiring
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto">
                Join as a Candidate
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-graphite-500 font-body font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-success" /> Free to join</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-success" /> No credit card required</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 relative w-full max-w-lg lg:max-w-none"
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            {/* Abstract UI Mockup */}
            <div className="relative rounded-2xl overflow-hidden border border-graphite-200/50 shadow-2xl bg-surface/50 backdrop-blur-xl aspect-square lg:aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                alt="Team Collaboration" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-graphite-950/80 via-graphite-900/40 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 bg-surface/90 backdrop-blur-md rounded-card p-6 border border-graphite-200/50 shadow-xl transform translate-y-4 hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-ai-100 flex items-center justify-center text-ai-600">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-graphite-950">AI Profile Match</h4>
                    <p className="text-sm text-graphite-600">98% Confidence Score</p>
                  </div>
                </div>
                <div className="w-full bg-graphite-100 rounded-full h-2">
                  <motion.div 
                    className="bg-ai-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface px-6 relative border-y border-graphite-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-graphite-950 mb-4">
              Everything you need to find the perfect fit.
            </h2>
            <p className="text-graphite-600 font-body text-lg">
              We go beyond traditional resumes, using verifiable data and AI to build a comprehensive picture of every candidate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck size={28} className="text-success" />}
              title="Verified Experience"
              description="Our system automatically verifies GitHub repositories and open-source contributions to ensure candidates have the experience they claim."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Trophy size={28} className="text-orange-500" />}
              title="Competitive Edge"
              description="Candidates participate in real-world technical challenges and hackathons, showcasing their problem-solving skills in action."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Search size={28} className="text-signal-600" />}
              title="Semantic Search"
              description="Recruiters can find candidates using natural language. Just type what you're looking for, and our AI will find the best match."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-graphite-950" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ai-600 rounded-full blur-[120px] opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-signal-600 rounded-full blur-[120px] opacity-20 pointer-events-none transform -translate-x-1/3 translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6">
            Ready to transform your hiring process?
          </h2>
          <p className="text-xl text-graphite-200 font-body mb-10">
            Join thousands of candidates and companies already using TrueSkills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/signup')} className="w-full sm:w-auto border-none shadow-xl shadow-white/10">
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-graphite-950 text-graphite-400 py-12 px-6 border-t border-graphite-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TrueSkills Logo" className="h-6 grayscale opacity-80" />
            <span className="text-lg font-logo font-bold text-white">TrueSkills</span>
          </Link>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} TrueSkills. All rights reserved.</p>
        </div>
      </footer>
    </PageTransition>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className="bg-canvas border border-graphite-200 rounded-card p-8 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-surface border border-graphite-100 flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold text-graphite-950 mb-3">{title}</h3>
      <p className="text-graphite-600 font-body leading-relaxed">{description}</p>
    </motion.div>
  )
}
