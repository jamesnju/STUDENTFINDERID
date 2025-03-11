"use client"

import { useState, useEffect, useRef } from "react"
import { MessageInput } from "@/components/message-input"
import { MessageBubble } from "@/components/message-bubble"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import baseUrl from "@/constant/constant"
import type { Message } from "../../types/message"
import type { Chat } from "../../types/chat"

// Import or define the ChatMessage interface
interface ChatMessage {
  id: number
  senderId: number
  receiverId: number
  text: string
  sentAt: string
  chatId: number
  sender?: {
    name: string
  }
  hasNewMessages?: boolean
}

// Update the props to accept either Chat or ChatMessage
interface ChatWindowProps {
  chat: Chat | ChatMessage
  currentUserId: number
}

export function ChatWindow({ chat, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Function to get chat ID regardless of chat type
  const getChatId = () => {
    // If it's a ChatMessage with chatId property
    if ("chatId" in chat) {
      return chat.chatId
    }
    // If it's a traditional Chat with id property
    return chat.id
  }

  // Function to get the other user's ID regardless of chat type
  const getOtherUserId = () => {
    // If it's a ChatMessage with senderId and receiverId
    if ("senderId" in chat && "receiverId" in chat) {
      return chat.senderId === currentUserId ? chat.receiverId : chat.senderId
    }
    // If it's a traditional Chat with user1Id and user2Id
    return chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id
  }

  // Function to get the other user's name if available
  const getOtherUserName = () => {
    // If it's a ChatMessage with sender info
    if ("sender" in chat && chat.sender?.name && chat.senderId !== currentUserId) {
      return chat.sender.name
    }
    // Otherwise use a generic name with ID
    return `User ${getOtherUserId()}`
  }

  const fetchMessages = async (showLoading = true) => {
    const chatId = getChatId()
    if (!chatId) return // Skip if chat has no ID

    if (showLoading) setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${baseUrl}chathistory/?chatId=${chatId}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch messages")
      }

      const data = await response.json()

      // Only update if we have new messages or this is the initial load
      if (showLoading || data.length !== messages.length) {
        setMessages(data)

        // Mark messages as read by updating the chat
        // if (data.length > 0 && ('hasNewMessages' in chat) && chat.hasNewMessages) {
        //   // This would typically be an API call to mark messages as read
        //   // For now, we'll just update the UI
        //   const event = new CustomEvent("markChatAsRead", {
        //     detail: { chatId: chatId },
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
    const chatId = getChatId()
    if (chatId) {
      fetchMessages()

      // Set up polling for real-time updates
      const intervalId = setInterval(() => {
        fetchMessages(false) // Pass false to avoid showing loading state
      }, 3000) // Poll every 3 seconds

      return () => clearInterval(intervalId)
    }
  }, [chat]) // Dependency on chat object

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    try {
      const chatId = getChatId()
      const receiverId = getOtherUserId()

      const response = await fetch(baseUrl + "sendmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId,
          text,
          chatId: chatId,
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
          <h2 className="text-lg font-semibold">Chat with {getOtherUserName()}</h2>
          <p className="text-sm text-muted-foreground">Chat #{getChatId()}</p>
        </div>
        <Button variant="ghost" size="icon" disabled={isLoading} onClick={() => fetchMessages()}>
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

