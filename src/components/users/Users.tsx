"use client";

import type React from "react";
import { useState } from "react";
import { Clipboard, Edit, Filter, Plus, Trash2, Loader } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { RevalidatePath } from "@/constant/RevalidateCustomPath";
import { deleteUser, getUserById, postUser, updateUser } from "@/actions/User";

export interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ReportLostIdProps {
  initialStudents: UserData[];
}

export default function Users({ initialStudents }: ReportLostIdProps) {
  const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserData | null>(null);
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    filterStudents(students, filterValue).length / itemsPerPage
  );

  function filterStudents(students: UserData[], filter: string) {
    if (!filter) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(filter.toLowerCase()) ||
        student.email.toLowerCase().includes(filter.toLowerCase())
    );
  }

  const getCurrentStudents = () => {
    const filteredStudents = filterStudents(students, filterValue);
    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingStudent) {
        await updateUser(Number(editingStudent.id), formData);
        const updatedStudent: UserData = {
          id: editingStudent.id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };
        setStudents(
          students.map((student) =>
            student.id === editingStudent.id ? updatedStudent : student
          )
        );
        toast.success(`${formData.name} has been updated successfully.`);
      } else {
        await postUser(formData.name, formData.email, formData.password);
        toast.success(`${formData.name} has been added successfully.`);
        RevalidatePath("/main/reportLostId");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setEditingStudent(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = async (student: UserData) => {
    try {
      const fetchedStudent: UserData = await getUserById(student.id);
      setEditingStudent(fetchedStudent);
      setFormData({
        name: fetchedStudent.name,
        email: fetchedStudent.email,
        password: fetchedStudent.password,
        role: fetchedStudent.role,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("There was an error fetching student details.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setStudents(students.filter((student) => student.id !== id));
      toast.success("The student has been deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("There was an error deleting the student.");
    }
  };

  const copyToClipboard = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success(`Student ID ${id} copied to clipboard.`);
  };

  const toggleFilter = () => {
    setIsFiltering(!isFiltering);
    if (isFiltering) {
      setFilterValue("");
      setCurrentPage(1);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Report LostId Management</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={toggleFilter}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        {isFiltering && (
          <div className="flex-1 px-4">
            <Input
              placeholder="Filter by name or email"
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentStudents().map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                {/* <TableCell>{student.password}</TableCell> */}
                <TableCell>{student.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(Number(student.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(student.id)}
                      className="relative"
                    >
                      <Clipboard className="h-4 w-4" />
                      <span className="sr-only">Copy ID</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {getCurrentStudents().length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {getCurrentStudents().length} of {students.length} students
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "Edit Student Details" : "Add New Student"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingStudent ? "update" : "add"} student details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin h-4 w-4" /> : editingStudent ? "Update" : "Add"} Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}