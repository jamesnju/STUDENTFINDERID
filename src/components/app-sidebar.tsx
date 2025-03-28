"use client";
import {
  BarChart3,
  FileSearch,
  Search,
  BadgeIcon as IdCard,
  CheckSquare,
  MessageSquare,
  Users,
  CreditCard,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
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
  const { data: session } = useSession();

  const navItems = [
    {
      name: "Dashboard",
      href: "/main/dashboard",
      icon: BarChart3,
      roles: ["ADMIN", "STUDENT"],
    },
    {
      name: "Report Lost ID",
      href: "/main/reportLostId",
      icon: FileSearch,
      roles: ["ADMIN", "STUDENT"],
      reason: "LOSTID",
    },
    {
      name: "Report Found ID",
      href: "/main/reportFoundId",
      icon: Search,
      roles: ["ADMIN", "STUDENT"],
      reason: "FOUNDID",
    },
    {
      name: "Reported LostIds",
      href: "/main/reportedLostIds",
      icon: IdCard,
      roles: ["ADMIN", "STUDENT"],
    },
    {
      name: "Reported FoundIds",
      href: "/main/reportedFoundIds",
      icon: CheckSquare,
      roles: ["ADMIN", "STUDENT"],
    },
    {
      name: "Chat",
      href: "/main/chats",
      icon: MessageSquare,
      roles: ["ADMIN", "STUDENT"],
    },
    { name: "User", href: "/main/users", icon: Users, roles: ["ADMIN"] },
    {
      name: "Payment",
      href: "/main/payment",
      icon: CreditCard,
      roles: ["ADMIN", "STUDENT"],
      reason: "LOSTID",
    },
    // {
    //   name: "Payment",
    //   href: "/main/payment",
    //   icon: CreditCard,
    //   roles: ["ADMIN"], ///go try see
    // },
  ];

  const userRole = session?.user?.role || "STUDENT"; // Assuming the user role is available in the session
  const userReason = session?.user?.reason || "FOUNDID"; // Assuming the reason is available in the session

  const permittedNavItems = navItems.filter(
    (item) =>
      item.roles.includes(userRole) &&
      (userRole === "ADMIN" || !item.reason || item.reason === userReason)
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/30 p-4 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/20 shadow-md">
            <AvatarImage
              src={user.avatar}
              alt={session?.user?.name || user.name}
            />
            <AvatarFallback className="bg-indigo-800 text-black font-extrabold">
              {(session?.user?.name || user.name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate font-medium text-white">
              {session?.user?.name || user.name}
            </span>
            <span className="truncate text-xs text-white/70">
              {session?.user?.email || user.email}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3 bg-gradient-to-b from-indigo-600 via-indigo-500 to-violet-600">
        <SidebarMenu>
          {permittedNavItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
                className={`transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-white/20 text-white font-medium shadow-md"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                  {/* {item.name === "Chat" && notificationCount > 0 && (
                    <Badge variant="secondary" className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-xs bg-white text-indigo-700 font-medium">
                      {notificationCount}
                    </Badge>
                  )} */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-3 bg-white/20" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/30 p-4 bg-violet-700">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail className="after:bg-white/10 hover:after:bg-white/20" />
    </Sidebar>
  );
}
