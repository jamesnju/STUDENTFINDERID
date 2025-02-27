export default function Home() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the Student ID Finder dashboard.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Total Students</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Recent Searches</h3>
              <p className="text-2xl font-bold">56</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Active Users</h3>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  