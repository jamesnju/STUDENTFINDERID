"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Clipboard, Edit, Filter, Plus, Trash2 } from "lucide-react";
import {
  postLostId,
  updateLostId,
  deleteLostId,
  getByLostId,
} from "@/actions/ReportLostId";
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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import baseUrl from "@/constant/constant";
import { RevalidatePath } from "@/constant/RevalidateCustomPath";
import baseImageUrl from "@/constant/uploadImage";
import { deleteReportedLostId } from "@/actions/ReportedLostIds";

export interface UserData {
  id: number;
  userId?: number;
  name: string;
  admissionNo: string;
  image: string;
  description: string;
  reportedAt?: string;
  status: string;
}
interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentMethod: "M-Pesa" | string;
  paymentStatus: "processing" | "completed" | "failed" | string;
  paymentDate: string; // ISO date string
  createdAt: string; // ISO date string
  transactionId: string;
  merchantRequestId: string | null;
  mpesaReceipt: string | null;
}
interface ReportLostIdProps {
  initialStudents: UserData[];
  payments: Payment[];
}

export default function ReportedFoudIds({
  initialStudents,
  payments,
}: ReportLostIdProps) {
  // use the passed prop data
  const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserData | null>(null);
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    admissionNo: "",
    description: "",
    image: null as File | null,
  });
  // imagePreview is used solely for display purposes.
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    filterStudents(students, filterValue).length / itemsPerPage
  );

  // Filter students based on name or admission number
  function filterStudents(students: UserData[], filter: string) {
    if (!filter) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(filter.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Get current students for pagination
  const getCurrentStudents = () => {
    const filteredStudents = filterStudents(students, filterValue);
    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    return filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (add or update student)
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Destructure userId from session; userId is a number.
  //   const userId = session?.user.id || 0;

  //   // Create FormData for API submission.
  //   const apiFormData = new FormData();
  //   apiFormData.append("name", formData.name);
  //   apiFormData.append("admissionNo", formData.admissionNo);
  //   apiFormData.append("description", formData.description);

  //   // Append the userId, converted to string since FormData accepts only string or Blob.
  //   apiFormData.append("userId", userId.toString());

  //   // Only append the image filename if an image is provided.
  //   if (formData.image) {
  //     apiFormData.append("image", formData.image);
  //   }

  //   try {
  //     if (editingStudent) {
  //       // Update API for an existing student.
  //       await updateLostId(Number(editingStudent.id), apiFormData);
  //       const updatedStudent: UserData = {
  //         id: editingStudent.id,
  //         name: formData.name,
  //         admissionNo: formData.admissionNo,
  //         description: formData.description,
  //         // If a new image is uploaded, use its filename; otherwise, retain previous image.
  //         image: formData.image ? formData.image.name : editingStudent.image,
  //       };
  //       setStudents(
  //         students.map((student) =>
  //           student.id === editingStudent.id ? updatedStudent : student
  //         )
  //       );
  //       toast.success(`${formData.name} has been updated successfully.`);
  //     } else {
  //       // Call the API to add a new student.
  //       await postLostId(apiFormData);
  //       toast.success(`${formData.name} has been added successfully.`);
  //       RevalidatePath("/main/reportLostId");
  //     }

  //     resetForm();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     toast.error("There was an error processing your request.");
  //   }
  // };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      admissionNo: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
    setEditingStudent(null);
  };

  // Open modal for adding new student
  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing student
  const handleEdit = async (student: UserData) => {
    try {
      // Call getByLostId to get the student's details.
      const fetchedStudent: UserData = await getByLostId(student.id);
      setEditingStudent(fetchedStudent);
      setFormData({
        name: fetchedStudent.name,
        admissionNo: fetchedStudent.admissionNo,
        description: fetchedStudent.description,
        image: null,
      });
      // For the image preview, we display the correct image URL based on baseImageUrl.
      setImagePreview(
        fetchedStudent.image
          ? `${baseImageUrl}${fetchedStudent.image}`
          : "/placeholder-image.jpg"
      );
      setIsModalOpen(true);
    } catch (error) {
      toast.error("There was an error fetching student details.");
    }
  };

  // Handle delete student
  const handleDelete = async (id: number) => {
    try {
      await deleteReportedLostId(id);
      setStudents(students.filter((student) => student.id !== id));
      toast.success("deleted successfully.");
    } catch (error) {
      toast.error("There was an error deleting the student.");
    }
  };

  // Copy student ID to clipboard.
  const copyToClipboard = (id: string | number) => {
    const userRole = session?.user.role;
    const userId = session?.user.id;
    const userReason = session?.user?.reason;
    const userPayment = payments.find((payment) => payment.userId === userId);

    if (userRole === "ADMIN" || userRole === "STUDENT" && userReason === "FOUNDID") {
      navigator.clipboard.writeText(id.toString());
      toast.success(`Student ID ${id} copied to clipboard.`);
    } else if (userRole === "STUDENT") {
      if (userPayment?.paymentStatus === "completed") {
        navigator.clipboard.writeText(id.toString());
        toast.success(`Student ID ${id} copied to clipboard.`);
      } else {
        toast.error("Pay to get the ID.");
      }
    } else {
      toast.error("You do not have permission to copy the ID.");
    }
  };

  // Toggle filter input.
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
        {/* <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Report LostId
        </Button> */}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={toggleFilter}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        {isFiltering && (
          <div className="flex-1 px-4">
            <Input
              placeholder="Filter by name or admission number"
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
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Reported userId</TableHead>
              <TableHead>Admission No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentStudents().map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Image
                    src={`${baseImageUrl}${student.image}`} // Ensure the correct path
                    alt={student.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="font-medium">{student.userId}</TableCell>
                <TableCell>{student.admissionNo}</TableCell>
                <TableCell className="max-w-xs truncate">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.status === "Report Found"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-red-800"
                    }`}
                  >
                    {student.status ?? "Unknown"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button> */}
                    {session?.user.role === "ADMIN" ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(Number(student.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(student.userId || "N/A")}
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
              {editingStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingStudent ? "update" : "add"} a
              student.
            </DialogDescription>
          </DialogHeader>
          <form>
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
                <Label htmlFor="admissionNo" className="text-right">
                  Admission No
                </Label>
                <Input
                  id="admissionNo"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
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
              <Button type="submit">
                {editingStudent ? "Update" : "Add"} Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
