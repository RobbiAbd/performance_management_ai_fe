import { Link, useLocation } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

function Navbar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isActive = (path: string) => location.pathname === path

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-heading text-2xl font-bold">
            SIPALING
          </Link>

          {/* Navigation Links & Dark Mode Toggle */}
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

            <Link to="/about">
              <Button
                variant={isActive('/about') ? 'default' : 'neutral'}
                className={cn(
                  isActive('/about') && 'border-2 border-border shadow-shadow'
                )}
              >
                About
              </Button>
            </Link>
            
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              {mounted && (
                <>
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                  <Moon className="h-4 w-4" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

