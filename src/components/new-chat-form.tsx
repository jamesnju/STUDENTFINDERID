"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chat } from "../../types/chat"
import baseUrl from "@/constant/constant"

interface NewChatFormProps {
  currentUserId: number
  onChatCreated: (chat: Chat) => void
}

export function NewChatForm({ currentUserId, onChatCreated }: NewChatFormProps) {
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      setError("Please enter a user ID")
      return
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
          user2Id: Number.parseInt(userId),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create chat")
      }

      const chat = await response.json()
      onChatCreated(chat)
      setUserId("")
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
        <Input
          id="userId"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          type="number"
          min="1"
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Chat"}
      </Button>
    </form>
  )
}

