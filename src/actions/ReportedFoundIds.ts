"use server";
import baseUrl from "@/constant/constant";

export async function deleteReportedFoundId(id: number){
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

export async function getReportedFoundId(){
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
      return data.foundIDs ?? null;
    } catch (error) {
      console.error("Error submitting :", error);
      //throw error; // Re-throw to handle errors outside this function
      return []; // Return an empty array as a fallback

    }
}