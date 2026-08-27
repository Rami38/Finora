import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user, logout } = useAuth()
  return (
    <>
      <Topbar />
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="bg-surface border border-border rounded-xl p-6 max-w-md">
          <p className="text-sm text-muted mb-1">Name</p>
          <p className="mb-4">{user?.name}</p>
          <p className="text-sm text-muted mb-1">Email</p>
          <p className="mb-6">{user?.email}</p>
          <button
            onClick={logout}
            className="bg-expense/10 text-expense border border-expense/30 hover:bg-expense/20 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
