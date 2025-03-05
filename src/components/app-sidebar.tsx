"use client"
import { Bell, Home, IdCard, IdCardIcon, LogOut, Text, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signOut, useSession } from "next-auth/react"

interface AppSidebarProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  notificationCount?: number
}

export function AppSidebar({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  notificationCount = 3,
}: AppSidebarProps) {
  const pathname = usePathname();
  const {data: session} = useSession();

  const navItems = [
    { name: "Dashboard", href: "/main/dashboard", icon: Home },
    { name: "Report Lost ID", href: "/main/reportLostId", icon: IdCardIcon },
    { name: "Report Found ID", href: "/main/reportFoundId", icon: IdCardIcon },
    { name: "Reported LostIds", href: "/main/reportedLostIds", icon: IdCard },
    { name: "Reported FoundIds", href: "/main/reportedFoundIds", icon: IdCard },
    { name: "Chat", href: "/main/chats", icon: Text },
    { name: "Profile", href: "/main/profile", icon: User },

  ]

  return (
    <Sidebar className="bg-[#34495E]">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={session?.user.name} />
            <AvatarFallback>{session?.user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate font-medium">{session?.user.name}</span>
            <span className="truncate text-xs text-sidebar-foreground/70">{session?.user.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2 ">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 min-w-5 rounded-full px-1 text-xs">
                  {notificationCount}
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button variant="outline" className="w-full justify-start gap-2 cursor-pointer" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

