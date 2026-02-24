import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Moon, Sun, LogOut, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { appConfig } from '@/lib/config'
import { clearAuth, getUser } from '@/lib/auth'
import ChatPopup from '@/components/ChatPopup'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const user = getUser()

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl">
            {appConfig.name}
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'neutral'}
                className={cn(
                  isActive('/') && 'border-2 border-border shadow-shadow'
                )}
              >
                Home
              </Button>
            </Link>
            <Link to="/summary">
              <Button
                variant={isActive('/summary') ? 'default' : 'neutral'}
                className={cn(
                  isActive('/summary') && 'border-2 border-border shadow-shadow'
                )}
              >
                Summary
              </Button>
            </Link>
            <Link to="/analytics">
              <Button
                variant={isActive('/analytics') ? 'default' : 'neutral'}
                className={cn(
                  isActive('/analytics') && 'border-2 border-border shadow-shadow'
                )}
              >
                Analytics
              </Button>
            </Link>

            <Button
              variant="neutral"
              size="icon"
              onClick={() => setChatOpen(true)}
              aria-label="Buka AI Assistant"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            {user && (
              <span className="text-sm text-foreground/80 hidden sm:inline">
                {user.full_name}
              </span>
            )}

            <Button
              variant="neutral"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {mounted && (
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatPopup open={chatOpen} onOpenChange={setChatOpen} />
    </nav>
  )
}

export default Navbar

