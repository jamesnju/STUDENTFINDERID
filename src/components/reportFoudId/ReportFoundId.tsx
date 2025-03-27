"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Clipboard, Edit, Filter, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { mutate } from "swr"; // Import mutate from SWR

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
import baseImageUrl from "@/constant/uploadImage";
import { deleteFoundId, getByFoundId, postFoundId, updateFoundId } from "@/actions/ReportFoundId";
import { RevalidatePath } from "@/constant/RevalidateCustomPath"; // Ensure correct import path

export interface UserData {
  id: number;
  userId?: number;
  name: string;
  admissionNo: string;
  image: string;
  status: string;
  reportedAt?: string;
}

interface ReportLostIdProps {
  initialStudents: UserData[];
}

export default function ReportFoundId({ initialStudents }: ReportLostIdProps) {
  const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    admissionNo: "",
    status: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(
    filterStudents(students, filterValue).length / itemsPerPage
  );

  function filterStudents(students: UserData[], filter: string) {
    if (!filter) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(filter.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(filter.toLowerCase())
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = session?.user.id || 0;

    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);
    apiFormData.append("admissionNo", formData.admissionNo);
    apiFormData.append("status", formData.status);
    apiFormData.append("userId", userId.toString());

    if (formData.image) {
      apiFormData.append("image", formData.image);
    }

    try {
      if (editingStudent) {
        await updateFoundId(Number(editingStudent.id), apiFormData);
        const updatedStudent: UserData = {
          id: editingStudent.id,
          name: formData.name,
          admissionNo: formData.admissionNo,
          status: formData.status,
          image: formData.image ? formData.image.name : editingStudent.image,
        };
        setStudents(
          students.map((student) =>
            student.id === editingStudent.id ? updatedStudent : student
          )
        );
        toast.success(`${formData.name} has been updated successfully.`);
        RevalidatePath("/main/reportFoundId"); // Revalidate path after updating

      } else {
        await postFoundId(apiFormData);
        window.location.reload();
        RevalidatePath("/main/reportFoundId"); // Revalidate path after adding
        toast.success(`${formData.name} has been added successfully.`);
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("There was an error processing your request.");
    }finally{
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      admissionNo: "",
      status: "",
      image: null,
    });
    setImagePreview(null);
    setEditingStudent(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = async (student: UserData) => {
    try {
      const fetchedStudent: UserData = await getByFoundId(student.id);
      setEditingStudent(fetchedStudent);
      setFormData({
        name: fetchedStudent.name,
        admissionNo: fetchedStudent.admissionNo,
        status: fetchedStudent.status,
        image: null,
      });
      setImagePreview(fetchedStudent.image ? `${baseImageUrl}${fetchedStudent.image}` : "/placeholder-image.jpg");
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("There was an error fetching details.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFoundId(id);
      setStudents(students.filter((student) => student.id !== id));
      toast.success("The item has been deleted successfully.");
      RevalidatePath("/main/reportFoundId"); // Revalidate path after deleting
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
        <h1 className="text-2xl font-bold">Report FoundId Page</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Report FoundId
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
              <TableHead>Admission No</TableHead>
              <TableHead>status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentStudents().map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Image
                  src={student.image ? `${baseImageUrl}${student.image}` : "/idc.png"}
                   //src={`${baseImageUrl}${student.image}` || "/idc.png"}
                    alt={student.name}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.admissionNo}</TableCell>
                <TableCell className="max-w-xs truncate">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.status === "foundId"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-pink-800"
                    }`}
                  >
                    {student.status ?? "Unknown"}
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
              Fill in the details below to {editingStudent ? "update" : "add"} a student.
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
  <Label htmlFor="status" className="text-right">
    Status
  </Label>
  <select
    id="status"
    name="status"
    value={formData.status}
    onChange={handleInputChange}
    className="col-span-3 p-2 border rounded-md"
    required
  >
    <option value="">Select Status</option>
    <option value="foundId">Found Id</option>
    <option value="Reconsiled with owner">Reconsiled with owner</option>
  </select>
</div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image<span>(Optional)</span>
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
              <Button type="submit" disabled={isLoading}>
                {editingStudent ? "Update" : "Add"} FoundID
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}