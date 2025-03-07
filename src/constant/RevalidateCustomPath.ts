"use server"

import { revalidatePath } from "next/cache"


export const RevalidatePath = async(path:string)=>{
    return revalidatePath(path)
}