import type React from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Student ID Finder</h1>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </SidebarInset>
  )
}

