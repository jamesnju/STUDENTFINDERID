"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { postPayment } from "@/actions/payments";
import { cn } from "@/lib/utils";

export default function PaymentPage({ payments }: { payments: any[] }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    userId: session?.user?.id || 0,
    phoneNumber: "",
    amount: 1, // Default amount
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await postPayment(formData);
      toast.success("Payment submitted successfully!");
      window.location.pathname = "/main/payment";
      setFormData({
        userId: session?.user?.id || 0,
        phoneNumber: "",
        amount: 1,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("There was an error processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  const userPayments = payments.filter(
    (payment) => payment.userId === session?.user?.id
  );

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "pending":
      case "processing":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "failed":
      case "error":
        return (
          <Badge className="bg-destructive hover:bg-destructive/90">
            <XCircle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4 space-y-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6" />
            Payment Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Your Payment History</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Make a Payment
            </Button>
          </div>

          {isAdmin ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">
                      Payment Method
                    </TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-medium">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString("KSH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        KSH{payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "max-w-[200px] truncate",
                          payment.failureReason && "text-destructive"
                        )}
                      >
                        {payment.failureReason || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              {userPayments.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium">
                          Payment Method
                        </TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium text-right">
                          Amount
                        </TableHead>
                        <TableHead className="font-medium">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userPayments.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="font-medium">
                            {payment.paymentMethod}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.paymentStatus)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString(
                              "KSH",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            KSH{payment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "max-w-[200px] truncate",
                              payment.failureReason && "text-destructive"
                            )}
                          >
                            {payment.failureReason || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No payment history available.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Make your first payment to see it here.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal using Dialog component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Make a Payment
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2  -translate-y-1/2 text-muted-foreground">
                  KSH
                </span>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  className="pl-12 bg-muted/30"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Standard payment amount
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
                className="focus:ring-primary"
              />
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  "Submit Payment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
