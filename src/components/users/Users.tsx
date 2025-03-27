"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  const [userData, setUserData] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log when editingStudent changes
  useEffect(() => {
    if (editingStudent) {
      console.log("Editing student set:", editingStudent);
    }
  }, [editingStudent]);

  // Debug: Log when userData changes
  useEffect(() => {
    console.log("Form data updated:", userData);
  }, [userData]);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingStudent) {
        // When updating, only send name, email, role, and reason
        const updateData = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          reason: "User updated", // Provide a default reason or modify as needed
        };

        console.log("Sending update data:", updateData);
        await updateUser(Number(userData.id), updateData);

        const updatedStudent: UserData = {
          ...editingStudent,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        };

        setStudents(
          students.map((student) =>
            student.id === userData.id ? updatedStudent : student
          )
        );
        toast.success(`${userData.name} has been updated successfully.`);
        window.location.pathname = "/main/users"
      } else {
        // When creating, send all fields including password
        await postUser(userData.name, userData.email, userData.password, "User registered");
        toast.success(`${userData.name} has been added successfully.`);
         window.location.pathname = "/main/users"
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
    setUserData({
      id: 0,
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
    setIsLoading(true);
    try {
      console.log("Fetching user with ID:", student.id);

      // Get the user data from the API
      const response = await getUserById(student.id);
      console.log("API Response:", response);

      // The API might return the data directly or nested in a property
      // Let's handle both cases
      let userData;

      if (response && typeof response === "object") {
        // If response is an object with error property, show error
        if (response.error) {
          toast.error(response.error);
          setIsLoading(false);
          return;
        }

        // Check if the response is the user data directly or nested
        if (response.id && response.name && response.email) {
          // Data is directly in the response
          userData = response;
        } else if (response.lostID && typeof response.lostID === "object") {
          // Data is nested in lostID property
          userData = response.lostID;
        } else {
          // Couldn't find user data in expected format
          console.error("Unexpected API response format:", response);
          toast.error("Unexpected data format received from server");
          setIsLoading(false);
          return;
        }
      } else {
        // Response is not an object
        console.error("Invalid API response:", response);
        toast.error("Invalid response received from server");
        setIsLoading(false);
        return;
      }

      console.log("Extracted user data:", userData);

      // Ensure we have the required fields
      if (!userData.id || !userData.name || !userData.email || !userData.role) {
        console.error("Missing required user data fields:", userData);
        toast.error("User data is incomplete");
        setIsLoading(false);
        return;
      }

      // Set the editing student with the fetched data
      const userToEdit: UserData = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: userData.password || "", // Store password hash but don't display it
        role: userData.role,
      };

      console.log("Setting editing student to:", userToEdit);
      setEditingStudent(userToEdit);

      // Set form data but explicitly leave password empty
      setUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: "", // Always clear password field when editing
        role: userData.role,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("There was an error fetching user details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setStudents(students.filter((student) => student.id !== id));
      toast.success("The user has been deleted successfully.");
      
    } catch (error) {
      console.log(error);
      toast.error("There was an error deleting the student.");
    }
  };

  const copyToClipboard = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success(`User ID ${id} copied to clipboard.`);
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
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentStudents().map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  {" "}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.role === "ADMIN"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {student.role}
                  </span>
                </TableCell>
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {getCurrentStudents().length} of {students.length} users
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
              {editingStudent ? "Edit User Details" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingStudent ? "update" : "add"}{" "}
              user details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {editingStudent && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="id"
                    name="id"
                    value={userData.id}
                    className="col-span-3"
                    disabled
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name}
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
                  value={userData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              {!editingStudent && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={userData.password}
                      onChange={handleInputChange}
                      className="w-full"
                      required={!editingStudent}
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="col-span-3 p-2 border rounded-md"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">ADMIN</option>
                  <option value="user">STUDENT</option>
                  {/* <option value="moderator">Moderator</option> */}
                </select>
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
                {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>{editingStudent ? "Update" : "Add"} User</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
