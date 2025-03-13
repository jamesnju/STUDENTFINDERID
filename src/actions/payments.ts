"use server"

import baseUrl from "@/constant/constant";
interface formData{
    userId: number;
    amount: number;
    phoneNumber: string;
}
 
export const getAllPayments = async() => {
  try {
    const res = await fetch( baseUrl + `payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error response data:", errorData);
      throw new Error(errorData?.message || "Failed to fetch payments");
    }

    const data = await res.json();
    console.log("Fetched Payments from API:", data);
    return data?.payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return null; // Re-throw to handle errors outside this function
  }
}
export const postPayment = async (pay:formData) => {
    try {
        const res = await fetch(`${baseUrl}mpesa`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pay),
        });
    
        if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Error response data:", errorData);
        throw new Error(errorData?.message || "Failed to submit payment");
        }
    
        const data = await res.json();
        console.log("Success:", data);
        return data;
    } catch (error) {
        console.error("Error submitting payment:", error);
        throw error; // Re-throw to handle errors outside this function
    }
    }