"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

// Define the student type
type Student = {
  id: string
  name: string
  admissionNo: string
  imageUrl: string
  description: string
}

 const  ReportFoundId =()=> {
  // State for students data
  const [students, setStudents] = useState<Student[]>([])
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Pagination settings
  const itemsPerPage = 5

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    admissionNo: "",
    imageUrl: "",
    description: "",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && currentStudent) {
      // Update existing student
      const updatedStudents = students.map((student) =>
        student.id === currentStudent.id ? { ...currentStudent, ...formData } : student,
      )
      setStudents(updatedStudents)
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        ...formData,
      }
      setStudents([...students, newStudent])
    }

    // Reset form and state
    resetForm()
  }

  // Reset form and related state
  const resetForm = () => {
    setFormData({
      name: "",
      admissionNo: "",
      imageUrl: "",
      description: "",
    })
    setCurrentStudent(null)
    setIsEditing(false)
    setIsDialogOpen(false)
  }

  // Handle edit student
  const handleEdit = (student: Student) => {
    setCurrentStudent(student)
    setFormData({
      name: student.name,
      admissionNo: student.admissionNo,
      imageUrl: student.imageUrl,
      description: student.description,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle delete student
  const handleDelete = (id: string) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Student Management</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsEditing(false)
                  resetForm()
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Student" : "Add New Student"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="admissionNo">Admission No</Label>
                  <Input
                    id="admissionNo"
                    name="admissionNo"
                    value={formData.admissionNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">{isEditing ? "Update" : "Add"} Student</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Admission No</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        {student.imageUrl ? (
                          <Image
                            src={student.imageUrl || "/placeholder.svg"}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            {student.name.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {student.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(student)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default ReportFoundId
