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
 
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Function to calculate monthly data
const calculateMonthlyData = (lostIDsData: any[], foundIDsData: any[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = months.map((month, index) => {
    const lostCount = lostIDsData.filter((item) => new Date(item.reportedAt).getMonth() === index).length;
    const foundCount = foundIDsData.filter((item) => new Date(item.reportedAt).getMonth() === index).length;
    return { name: month, lost: lostCount, found: foundCount };
  });
  return data;
};

const statusData = [
  { name: "Reconsiled with owner", value: 35 },
  { name: "Report LostId", value: 15 },
  { name: "FoundId", value: 55 },
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
const STATUS_COLORS = ["#10b981", "#f59e0b", "green"]

export default function AdminDashboard({ lostIDsData, foundIDsData,getStudents }: { lostIDsData: any; foundIDsData: any; getStudents: any }) {
  const [searchQuery, setSearchQuery] = useState("")
const totalStudents = getStudents.length;
  // Filter data based on search query
  const filteredLostIDs = lostIDsData.filter(
    (item:any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFoundIDs = foundIDsData.filter(
    (item:any) =>
      item.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const monthlyData = calculateMonthlyData(lostIDsData, foundIDsData);

  return (
      <div className="flex min-h-screen">

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            
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
                  <div className="text-3xl font-bold">{lostIDsData.length}</div>
                  <p className="text-xs opacity-80">
                    {lostIDsData.filter((id:any) => id.status === "Reconsiled with owner").length} matched
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-primary-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Found IDs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{foundIDsData.length}</div>
                  <p className="text-xs opacity-80">
                    {foundIDsData.filter((id:any) => id.status === "Reconsiled with owner").length} matched
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
                    <CardDescription>Reconsiled vs Lost IDs</CardDescription>
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
                {/* <Card className="col-span-3">
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
                </Card> */}
              </div>
            </div>
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
              {/* <Button variant="outline" size="sm" className="ml-auto">
                Help
              </Button> */}
            </div>
            <Tabs defaultValue="lost" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="lost">Lost IDs</TabsTrigger>
                  <TabsTrigger value="found">Found IDs</TabsTrigger>
                </TabsList>
                {/* <Button>Match IDs</Button> */}
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
                          {/* <TableHead>Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLostIDs.length > 0 ? (
                          filteredLostIDs.map((item:any) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.admissionNo}</TableCell>
                              <TableCell>{item.reportedAt}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    item.status === "Reconsiled with owner"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </TableCell>
                              {/* <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </TableCell> */}
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
                          {/* <TableHead>Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFoundIDs.length > 0 ? (
                          filteredFoundIDs.map((item:any) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.admissionNo}</TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell>{item.reportedAt}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    item.status === "Reconsiled with owner"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </TableCell>
                              {/* <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </TableCell> */}
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
