import baseUrl from "@/constant/constant"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ chatId: string } >}) {
  const {chatId} = await params

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
  }

  try {
    // This would call your backend API
    const response = await fetch(`${baseUrl}chats/${chatId}/messages`)

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch messages" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

