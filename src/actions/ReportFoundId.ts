"use server";

import baseUrl from "@/constant/constant";
import axios from "axios";
import { revalidateTag } from "next/cache";


export async function postFoundId(apiFormData: FormData) {
  try {
    const res = await fetch(baseUrl + "foundID", {
      method: "POST",
      body: apiFormData, // No need for JSON.stringify
    });

    console.log(apiFormData, "submitted  foundID apiFormData-----t--- data----");

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


export async function updateFoundId(id: number, apiFormData: FormData) {
  try {
    const res = await fetch(baseUrl + `foundID/${id}`, {
      method: "PATCH",
      body: apiFormData, // No need for JSON.stringify
    });

    console.log(apiFormData, "submitted apiFormData-----t--- data----");

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

export async function deleteFoundId(id: number){
    try{
    const res = await fetch(baseUrl + "foundID/"+ id,{
        method:"DELETE",
        headers:{
            "Content-Type": "application/json"
        }
    })
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Error response data:", errorData);
        throw new Error(errorData?.message || "Failed ");
      }
  
      const data = await res.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error submitting:", error);
      throw error; // Re-throw to handle errors outside this function
    }
}

export async function getAllFoundId(){
    try{
    const res = await fetch(baseUrl + "foundIDs",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        }
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Error response data:", errorData);
        throw new Error(errorData?.message || "Failed ");
      }
  
      const data = await res.json();
      //console.log("Success:-------------111", data);
      return data.foundIDs;
    } catch (error) {
      console.error("Error submitting :", error);
      //throw error; // Re-throw to handle errors outside this function
      return []; // Return an empty array as a fallback

    }
}



export const getByFoundId = async (id: number | undefined) => {
  if (!id) {
    console.error('Invalid ID:', id);
    return { error: 'Invalid ID provided', status: 400 };
  }

  const url = `${baseUrl}${id}/foundID`;
  console.log('Request URL:', url);

  try {
    const response = await axios.get(url);
    revalidateTag("")
    return response.data?.foundID ?? {};
  } catch (error: any) {
    console.error('Error fetching found ID:', error.message);
    //return { error: error.message, status: error.response?.status || 400 };
    return []; // Return an empty array as a fallback

  }
};



