"use server";
import baseUrl from "@/constant/constant";

export async function deleteReportedLostId(id: number){
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
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error submitting user:", error);
      throw error; // Re-throw to handle errors outside this function
    }
}

export async function getAllReportedLostId(){
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