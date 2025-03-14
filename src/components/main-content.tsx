"use client"
import type React from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <SidebarInset className="">
      <header className="sticky top-0 z-10 flex h-16 items-center bg-background/95 bg-gradient-to-r from-blue-500 to-purple-500 backdrop-blur supports-[backdrop-filter]:bg-background/60 gap-4 border-b px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1 ">
          <h1 className="text-xl font-semibold">Student ID Finder</h1>
        </div>
        <div className="">
        <Button variant="outline" className="w-full justify-start gap-2 cursor-pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </SidebarInset>
  )
}

