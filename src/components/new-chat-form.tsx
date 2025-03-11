"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Chat } from "../../types/chat"
import baseUrl from "@/constant/constant"
import { ChatMessage } from "@/app/main/chats/pageview"
// import type { ChatMessage } from "@/app/chat-app" // Import the ChatMessage type

interface NewChatFormProps {
  currentUserId: number
  onChatCreated: (chat: Chat | ChatMessage) => void
}

export function NewChatForm({ currentUserId, onChatCreated }: NewChatFormProps) {
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [foundUser, setFoundUser] = useState<{ id: number; name: string } | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Function to fetch user by ID
  const fetchUserById = async (id: string) => {
    if (!id || isNaN(Number(id))) return

    setIsSearching(true)
    setError("")
    setFoundUser(null)

    try {
      const response = await fetch(`${baseUrl}${id}/user`)

      if (!response.ok) {
        throw new Error("User not found")
      }

      const userData = await response.json()
      setFoundUser({
        id: Number(id),
        name: userData.name,
      })
    } catch (err) {
      setError("User not found. Please check the ID and try again.")
    } finally {
      setIsSearching(false)
    }
  }

  // Handle input change with debounce
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserId(value)

    // Clear previous user if input is cleared
    if (!value) {
      setFoundUser(null)
      return
    }
  }

  // Handle search button click
  const handleSearchUser = () => {
    if (userId) {
      fetchUserById(userId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setError("Please enter a user ID")
      return
    }

    // If we haven't searched for the user yet, do it now
    if (!foundUser && !isSearching) {
      await fetchUserById(userId)
      // If we still don't have a user after searching, stop here
      if (!foundUser) return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(baseUrl + "create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1Id: currentUserId,
          user2Id: foundUser ? foundUser.id : Number.parseInt(userId),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create chat")
      }

      const chat = await response.json()

      // Create a ChatMessage object with the user's name
      const chatMessage: ChatMessage = {
        id: chat.id,
        chatId: chat.id,
        senderId: currentUserId,
        receiverId: foundUser ? foundUser.id : Number.parseInt(userId),
        text: "", // No initial message
        sentAt: new Date().toISOString(),
        sender: {
          name: foundUser?.name || `User ${userId}`,
        },
      }

      onChatCreated(chatMessage)
      setUserId("")
      setFoundUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="userId">Start a new chat</Label>
        <div className="flex space-x-2">
          <Input
            id="userId"
            placeholder="Enter user ID"
            value={userId}
            onChange={handleUserIdChange}
            type="number"
            min="1"
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSearchUser}
            disabled={!userId || isSearching || isLoading}
          >
            {isSearching ? "..." : "Find"}
          </Button>
        </div>
      </div>

      {foundUser && (
        <div className="bg-primary/10 p-2 rounded-md flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-xs font-medium">{foundUser.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{foundUser.name}</p>
            <p className="text-xs text-muted-foreground">ID: {foundUser.id}</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading || isSearching || (!foundUser && userId !== "")}>
        {isLoading ? "Creating..." : "Create Chat"}
      </Button>
    </form>
  )
}

