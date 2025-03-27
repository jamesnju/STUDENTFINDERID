
"use server"
import baseUrl from "@/constant/constant";
import axios from "axios";
interface formData {
  //id: number;
  name: string;
  email: string;
  //password: string;
  role: string;
  reason: string;

  
}
export async function postUser(name: string, email: string, password: string,reason: string) {
  try {
    const res = await fetch(`${baseUrl}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, reason }),
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

    //console.log("Login response status:", res.status);

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

export const getAllUsers = async()=>{
  try {
    const res = await fetch(baseUrl + "users",{
      method:"GET"
    })
    if(!res.ok){
      const errorData = await res.json().catch(() => null);
      console.error("Error rsponse data:", errorData);
      throw new Error(errorData?.message || "Invalid credentials");
    }
    const data = await res.json();
    console.log("fetched user from Api:", data.data);
    return data?.data;
  } catch (error) {
    console.log("Error fetching user",error);
    return null;
  }
}

export async function updateUser(id: number, updateData: formData) {
  try {
    const res = await fetch(baseUrl + `${id}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData), 
    });

    console.log(updateData, "submitted apiFormData-----t--- data----");

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error response data:", errorData);
      throw new Error(errorData?.message || "Failed to submit data");
    }

    const data = await res.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error submitting user:", error);
    throw error;
  }
}


export async function deleteUser(id: number){
    try{
    const res = await fetch(baseUrl + `${id}/user`,{
        method:"DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    })
    
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

export const getUserById = async (id: number | undefined) => {
  if (!id) {
    console.error('Invalid ID:', id);
    return { error: 'Invalid ID provided', status: 400 };
  }

  const url = `${baseUrl}${id}/user`;
  console.log('Request URL:', url);

  try {
    const response = await axios.get(url);
    return response.data ?? {};
  } catch (error: any) {
    console.error('Error fetching lost ID:', error.message);
    return { error: error.message, status: error.response?.status || 400 };
  }
};