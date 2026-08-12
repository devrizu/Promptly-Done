import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageTransition } from '../components/layout/PageTransition'
import { AlertCircle } from 'lucide-react'

export function NotFoundPage() {
  return (
    <PageTransition className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-signal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-signal-600">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-4xl font-display font-bold text-graphite-950 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-graphite-600 font-body mb-8">
          Oops! The page you are looking for doesn't exist, has been moved, or you don't have access to it.
        </p>
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto">
            Return Home
          </Button>
        </Link>
      </div>
    </PageTransition>
  )
}
