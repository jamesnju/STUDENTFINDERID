"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { postPayment } from "@/actions/payments";

export default function PaymentPage({ payments }: { payments: any[] }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    userId: session?.user?.id || 0,
    phoneNumber: "",
    amount: 500, // Default amount
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
      setFormData({
        userId: session?.user?.id || 0,
        phoneNumber: "",
        amount: 500,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("There was an error processing your payment.");
    } finally {
      setLoading(false);
    }
  };

  const userPayments = payments.filter(payment => payment.userId === session?.user?.id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Page</h1>
        <Button onClick={() => setIsModalOpen(true)} className="mb-6 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
          Pay
        </Button>
        {userPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Payment Method</th>
                  <th className="py-2 px-4 border-b">Payment Status</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Failed Reason</th>
                  {/* <th className="py-2 px-4 border-b">User ID</th> */}
                </tr>
              </thead>
              <tbody>
                {userPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2 px-4 border-b">{payment.paymentMethod}</td>
                    <td className="py-2 px-4 border-b">{payment.paymentStatus}</td>
                    <td className="py-2 px-4 border-b">{new Date(payment.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{payment.amount}</td>
                    <td className="py-2 px-4 border-b">  {payment.failureReason || "Incomplete Transaction"} 
                    </td>

                    {/* <td className="py-2 px-4 border-b">{payment.userId}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500">No payments yet.</div>
        )}
      </div>

      {/* Modal for payment form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Make a Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="amount" className="block text-gray-700">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  className="mt-1 block w-full bg-gray-200"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="phoneNumber" className="block text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded" disabled={loading}>
                  {loading ? "Processing..." : "Submit Payment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}