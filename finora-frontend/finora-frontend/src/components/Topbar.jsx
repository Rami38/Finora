import { Search, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function greetingFor(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const greeting = greetingFor(new Date().getHours())

  return (
    <header className="flex items-center justify-between px-8 h-16 border-b border-border">
      <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-3 py-1.5 w-72">
        <Search size={16} className="text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm placeholder:text-muted w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-white relative" aria-label="Notifications">
          <Bell size={19} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-expense" />
        </button>
        <button
          onClick={logout}
          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium"
          title="Log out"
        >
          {user?.name?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>
    </header>
  )
}

export { greetingFor }
