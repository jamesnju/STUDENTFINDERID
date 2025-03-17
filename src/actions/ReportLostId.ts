"use server";

import baseUrl from "@/constant/constant";
import axios from "axios";
import { revalidatePath } from "next/cache";


export async function postLostId(apiFormData: FormData) {
  try {
    const res = await fetch(baseUrl + "lostID", {
      method: "POST",
      body: apiFormData, // No need for JSON.stringify
    });

    //console.log(apiFormData, "submitted apiFormData-----t--- data----");

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Error response data:", errorData);
      throw new Error(errorData?.message || "Failed to submit data");
    }

    const data = await res.json();
    revalidatePath("/main/reportLostId")
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error submitting user:", error);
    throw error;
  }
}


export async function updateLostId(id: number, apiFormData: FormData) {
  try {
    const res = await fetch(baseUrl + `lostID/${id}`, {
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
    revalidatePath("/main/reportLostId")
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error submitting user:", error);
    throw error;
  }
}

export async function deleteLostId(id: number){
    try{
    const res = await fetch(baseUrl + "lostID/"+ id,{
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
      revalidatePath("/main/reportLostId")

      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error submitting user:", error);
      throw error; // Re-throw to handle errors outside this function
    }
}

export async function getAllLostId(){
    try{
    const res = await fetch(baseUrl + "lostIDs",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
        }
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Error response data:", errorData);
        throw new Error(errorData?.message || "Failed to register user");
      }
  
      const data = await res.json();
      //console.log("Success:-------------111", data);
      return data.lostIDs;
    } catch (error) {
      console.error("Error submitting user:", error);
      //throw error; // Re-throw to handle errors outside this function
      return []; // Return an empty array as a fallback

    }
}



export const getByLostId = async (id: number | undefined) => {
  if (!id) {
    console.error('Invalid ID:', id);
    return { error: 'Invalid ID provided', status: 400 };
  }

  const url = `${baseUrl}${id}/lostID`;
  console.log('Request URL:', url);

  try {
    const response = await axios.get(url);
    return response.data?.lostID ?? {};
  } catch (error: any) {
    console.error('Error fetching lost ID:', error.message);
    return { error: error.message, status: error.response?.status || 400 };
  }
};



