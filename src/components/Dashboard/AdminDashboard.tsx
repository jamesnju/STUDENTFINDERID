"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  CheckCircle,
  CreditCard,
  Home,
  PieChart,
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Mock data for the tables
const lostIDsData = [
  { id: "L001", studentName: "John Doe", studentId: "STU12345", reportDate: "2025-03-10", status: "Pending" },
  { id: "L002", studentName: "Jane Smith", studentId: "STU67890", reportDate: "2025-03-11", status: "Pending" },
  { id: "L003", studentName: "Alex Johnson", studentId: "STU54321", reportDate: "2025-03-12", status: "Matched" },
  { id: "L004", studentName: "Sarah Williams", studentId: "STU09876", reportDate: "2025-03-13", status: "Pending" },
  { id: "L005", studentName: "Michael Brown", studentId: "STU13579", reportDate: "2025-03-14", status: "Matched" },
]

const foundIDsData = [
  {
    id: "F001",
    foundBy: "Library Staff",
    studentId: "STU67890",
    foundLocation: "Main Library",
    reportDate: "2025-03-11",
    status: "Pending",
  },
  {
    id: "F002",
    foundBy: "Security",
    studentId: "STU54321",
    foundLocation: "Student Center",
    reportDate: "2025-03-12",
    status: "Matched",
  },
  {
    id: "F003",
    foundBy: "Cafeteria Staff",
    studentId: "STU24680",
    foundLocation: "Cafeteria",
    reportDate: "2025-03-13",
    status: "Pending",
  },
  {
    id: "F004",
    foundBy: "Student",
    studentId: "STU13579",
    foundLocation: "Gym",
    reportDate: "2025-03-14",
    status: "Matched",
  },
  {
    id: "F005",
    foundBy: "Faculty",
    studentId: "STU97531",
    foundLocation: "Science Building",
    reportDate: "2025-03-15",
    status: "Pending",
  },
]

// Mock data for charts
const monthlyData = [
  { name: "Jan", lost: 12, found: 8 },
  { name: "Feb", lost: 19, found: 15 },
  { name: "Mar", lost: 25, found: 22 },
  { name: "Apr", lost: 18, found: 16 },
  { name: "May", lost: 22, found: 19 },
  { name: "Jun", lost: 15, found: 13 },
]

const statusData = [
  { name: "Matched", value: 35 },
  { name: "Pending", value: 65 },
]

const locationData = [
  { name: "Library", value: 28 },
  { name: "Student Center", value: 22 },
  { name: "Cafeteria", value: 18 },
  { name: "Gym", value: 15 },
  { name: "Classrooms", value: 12 },
  { name: "Other", value: 5 },
]

// Colors for charts
const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
const STATUS_COLORS = ["#10b981", "#f59e0b"]

export default function AdminDashboard({ totalStudents = 1234, totalLostIds = 0, totalFoundIds = 0 }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data based on search query
  const filteredLostIDs = lostIDsData.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFoundIDs = foundIDsData.filter(
    (item) =>
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.foundLocation.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
      <div className="flex min-h-screen">
        {/* <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <CreditCard className="h-6 w-6" />
              <span className="font-bold">ID Finder Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="#">
                        <Home />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <CreditCard />
                        <span>Lost IDs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <CheckCircle />
                        <span>Found IDs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Users />
                        <span>Students</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <BarChart3 />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Shield />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <Settings />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Admin User</span>
                  <span className="text-xs text-sidebar-foreground/70">admin@school.edu</span>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar> */}

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <form className="flex-1 md:max-w-sm lg:max-w-lg">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search IDs, students..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              <Button variant="outline" size="sm" className="ml-auto">
                Help
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome to the Student ID Finder admin dashboard. Manage lost and found student IDs.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalStudents}</div>
                  <p className="text-xs opacity-80">Registered in the system</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Lost IDs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalLostIds || lostIDsData.length}</div>
                  <p className="text-xs opacity-80">
                    {lostIDsData.filter((id) => id.status === "Matched").length} matched
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Found IDs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalFoundIds || foundIDsData.length}</div>
                  <p className="text-xs opacity-80">
                    {foundIDsData.filter((id) => id.status === "Matched").length} matched
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Visual Diagrams Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Analytics Overview</h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Trend Chart */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Lost vs Found Trend
                    </CardTitle>
                    <CardDescription>Monthly comparison of lost and found IDs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="lost" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="found" stroke="#ec4899" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Status Distribution
                    </CardTitle>
                    <CardDescription>Matched vs pending IDs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Distribution */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Found ID Locations
                    </CardTitle>
                    <CardDescription>Where IDs are most commonly found</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="value" name="Number of IDs" fill="#8b5cf6">
                            {locationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="lost" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="lost">Lost IDs</TabsTrigger>
                  <TabsTrigger value="found">Found IDs</TabsTrigger>
                </TabsList>
                <Button>Match IDs</Button>
              </div>

              <TabsContent value="lost" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Lost ID Reports</CardTitle>
                    <CardDescription>Manage all reported lost student IDs.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Report Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLostIDs.length > 0 ? (
                          filteredLostIDs.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.studentName}</TableCell>
                              <TableCell>{item.studentId}</TableCell>
                              <TableCell>{item.reportDate}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    item.status === "Matched"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              No lost IDs found matching your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="found" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Found ID Reports</CardTitle>
                    <CardDescription>Manage all reported found student IDs.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Found By</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Report Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFoundIDs.length > 0 ? (
                          filteredFoundIDs.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.foundBy}</TableCell>
                              <TableCell>{item.studentId}</TableCell>
                              <TableCell>{item.foundLocation}</TableCell>
                              <TableCell>{item.reportDate}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    item.status === "Matched"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">
                              No found IDs matching your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
  )
}

