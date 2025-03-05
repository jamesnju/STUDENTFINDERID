
"use server"
import baseUrl from "@/constant/constant";

export async function postUser(name: string, email: string, password: string) {
  try {
    const res = await fetch(`${baseUrl}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error response data:", errorData);
      throw new Error(errorData?.message || "Failed to register user");
    }

    const data = await res.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error submitting user:", error);
    throw error; // Re-throw to handle errors outside this function
  }
}


export  const  getUser = async(email: string, password: string) =>{
  try {
    const res = await fetch(`${baseUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error response data:", errorData);
      throw new Error(errorData?.message || "Invalid credentials");
    }

    const data = await res.json();
    console.log("Fetched User from API:", data);

    return data; // Ensure this matches the API response format
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null for failed logins
  }
}
