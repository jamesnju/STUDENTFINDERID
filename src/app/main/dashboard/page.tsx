import { getReportedFoundId } from '@/actions/ReportedFoundIds';
import { getAllReportedLostId } from '@/actions/ReportedLostIds';
import React from 'react'

const page = async() => {
  const getTotalfound = await getReportedFoundId() ?? [];
  const getTotalLost = await getAllReportedLostId() ?? [];


  const found = getTotalfound.length;
  const lost = getTotalLost.length;

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
              <h3 className="font-medium">Total Reported LostIds</h3>
              <p className="text-2xl font-bold">{lost || 0}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Total Reported FoundIds</h3>
              <p className="text-2xl font-bold">{found || 0}</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default page