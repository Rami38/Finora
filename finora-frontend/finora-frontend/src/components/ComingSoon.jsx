import Topbar from '../components/Topbar'

export default function ComingSoon({ title, description }) {
  return (
    <>
      <Topbar />
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold mb-1">{title}</h1>
        <p className="text-sm text-muted mb-6">{description}</p>
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-muted text-sm">This page is coming in a later step of the build.</p>
        </div>
      </div>
    </>
  )
}
