"use client"

import { useState, useEffect, useRef } from "react"

import { MessageInput } from "@/components/message-input"
import { MessageBubble } from "@/components/message-bubble"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import baseUrl from "@/constant/constant"
import { Message } from "../../types/message"
import { Chat } from "../../types/chat"

interface ChatWindowProps {
  chat: Chat
  currentUserId: number
}

export function ChatWindow({ chat, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async (showLoading = true) => {
    if (!chat?.id) return; // Skip if chat is null or has no ID

  if (showLoading) setIsLoading(true);
  setError("");

    try {
      const response = await fetch(`${baseUrl}chathistory/?chatId=${chat.id}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch messages")
      }

      const data = await response.json()

      // Only update if we have new messages or this is the initial load
      if (showLoading || data.length !== messages.length) {
        setMessages(data)

        // Mark messages as read by updating the chat
        // if (data.length > 0 && chat.hasNewMessages) {
        //   // This would typically be an API call to mark messages as read
        //   // For now, we'll just update the UI
        //   const event = new CustomEvent("markChatAsRead", {
        //     detail: { chatId: chat.id },
        //   })
        //   window.dispatchEvent(event)
        // }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (chat?.id) {
      fetchMessages()

      // Set up polling for real-time updates
      const intervalId = setInterval(() => {
        fetchMessages(false) // Pass false to avoid showing loading state
      }, 3000) // Poll every 3 seconds

      return () => clearInterval(intervalId)
    }
  }, [chat?.id]) // Added fetchMessages to dependencies

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) // Removed messages from dependencies

  const handleSendMessage = async (text: string) => {
    try {
      const receiverId = chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id

      const response = await fetch(baseUrl + "sendmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId,
          text,
          chatId: chat.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send message")
      }

      const newMessage = await response.json()
      setMessages((prev) => [...prev, newMessage])
    } catch (err) {
      console.error("Error sending message:", err)
      setError(err instanceof Error ? err.message : "Failed to send message")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Chat with User {chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id}
          </h2>
          <p className="text-sm text-muted-foreground">Chat #{chat.id}</p>
        </div>
        <Button variant="ghost" size="icon"  disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} isCurrentUser={message.senderId === currentUserId} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
      </div>

      <div className="border-t border-border p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

