import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import NextAuthSessionProvider from "@/components/Session/NextAuthSessionProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student ID Finder",
  description: "Find student IDs easily",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
        <SidebarProvider >
          <div className="flex min-h-screen w-screen ">
            <AppSidebar
              user={{
                name: "John Doe",
                email: "john.doe@university.edu",
                avatar: "/placeholder.svg?height=40&width=40",
              }}
              notificationCount={5}
            />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}

