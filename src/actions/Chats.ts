// "use server"
// import baseUrl from "@/constant/constant"
// import { type NextRequest, NextResponse } from "next/server"

// export async function createPOST(req: NextRequest) {
//   const body = await req.json()
//   const { user1Id, user2Id } = body

//   if (!user1Id || !user2Id) {
//     return NextResponse.json({ error: "Both user1Id and user2Id are required" }, { status: 400 })
//   }

//   try {
//     // This would call your backend API
//     const response = await fetch(baseUrl + "create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ user1Id, user2Id }),
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json({ error: data.error || "Failed to create chat" }, { status: response.status })
//     }

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error("Error creating chat:", error)
//     return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
//   }
// }

