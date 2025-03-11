"use client"

import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import baseUrl from "@/constant/constant"

// Updated interface to match your actual data structure
interface ChatMessage {
  id: number
  senderId: number
  receiverId: number
  text: string
  sentAt: string
  chatId: number
  sender: {
    name: string
  }
  hasNewMessages?: boolean
}

interface User {
  id: number
  name: string
}

interface ChatListProps {
  chats: ChatMessage[]
  selectedChatId?: number
  onSelectChat: (chat: ChatMessage) => void
  currentUserId: number
}

export function ChatList({ chats, selectedChatId, onSelectChat, currentUserId }: ChatListProps) {
  const [visibleChats, setVisibleChats] = useState(6)
  const [userCache, setUserCache] = useState<Record<number, User>>({})
  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({})

  // Group messages by chatId
  const chatGroups = useMemo(() => {
    const groups: Record<number, ChatMessage[]> = {}

    chats.forEach((message) => {
      if (!groups[message.chatId]) {
        groups[message.chatId] = []
      }
      groups[message.chatId].push(message)
    })

    return groups
  }, [chats])

  // Get the latest message for each chat
  const latestMessages = useMemo(() => {
    return Object.entries(chatGroups).map(([chatId, messages]) => {
      // Sort messages by date (newest first)
      const sortedMessages = [...messages].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())

      // Return the latest message
      return sortedMessages[0]
    })
  }, [chatGroups])

  // Sort chats by latest message date
  const sortedChats = useMemo(() => {
    return [...latestMessages].sort((a, b) => {
      return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    })
  }, [latestMessages])

  // Fetch user information for users we don't have in cache
  useEffect(() => {
    const userIdsToFetch = new Set<number>()

    // Collect all unique user IDs that we need to fetch
    sortedChats.forEach((chat) => {
      // If current user is the sender, we need the receiver's info
      if (chat.senderId === currentUserId) {
        const receiverId = chat.receiverId
        if (!userCache[receiverId] && !loadingUsers[receiverId]) {
          userIdsToFetch.add(receiverId)
        }
      }
      // If current user is the receiver, we might need the sender's info if it's not in the message
      else if (chat.receiverId === currentUserId && (!chat.sender || !chat.sender.name)) {
        const senderId = chat.senderId
        if (!userCache[senderId] && !loadingUsers[senderId]) {
          userIdsToFetch.add(senderId)
        }
      }
    })

    // Fetch user data for each ID
    userIdsToFetch.forEach(async (userId) => {
      try {
        // Mark this user as loading
        setLoadingUsers((prev) => ({ ...prev, [userId]: true }))

        // Fetch user data from your API
        const response = await fetch(`${baseUrl}${userId}/user`)

        if (response.ok) {
          const userData = await response.json()

          // Add user to cache
          setUserCache((prev) => ({
            ...prev,
            [userId]: {
              id: userId,
              name: userData.name,
            },
          }))
        } else {
          console.error(`Failed to fetch user ${userId}: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error)
      } finally {
        // Mark as no longer loading regardless of success/failure
        setLoadingUsers((prev) => ({ ...prev, [userId]: false }))
      }
    })
  }, [sortedChats, userCache, loadingUsers, currentUserId])

  // Get the other user's info (the one we're chatting with)
  const getOtherUserInfo = (chat: ChatMessage) => {
    // If current user is the receiver, then the other user is the sender
    if (chat.receiverId === currentUserId) {
      // Use sender info from the message if available
      if (chat.sender?.name) {
        return {
          id: chat.senderId,
          name: chat.sender.name,
        }
      }

      // Otherwise check our cache
      if (userCache[chat.senderId]) {
        return userCache[chat.senderId]
      }

      // Fallback to ID if we don't have the name yet
      return {
        id: chat.senderId,
        name: loadingUsers[chat.senderId] ? "Loading..." : `User ${chat.senderId}`,
      }
    }

    // If current user is the sender, then the other user is the receiver
    // Check our cache for the receiver's info
    if (userCache[chat.receiverId]) {
      return userCache[chat.receiverId]
    }

    // Fallback to ID if we don't have the name yet
    return {
      id: chat.receiverId,
      name: loadingUsers[chat.receiverId] ? "Loading..." : `User ${chat.receiverId}`,
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a")
    }

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return format(date, "EEE")
    }

    return format(date, "MMM d")
  }

  const handleLoadMore = () => {
    setVisibleChats((prev) => prev + 4)
  }

  if (sortedChats.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-center">No chats yet. Start a new conversation!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-1 p-2">
        {sortedChats.slice(0, visibleChats).map((chat) => {
          const otherUser = getOtherUserInfo(chat)

          return (
            <Button
              key={chat.chatId}
              variant={chat.chatId === selectedChatId ? "secondary" : "ghost"}
              className={cn("w-full justify-start px-3 py-2 h-auto", chat.chatId === selectedChatId && "bg-secondary")}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-center w-full">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">{otherUser.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {chat.hasNewMessages && chat.chatId !== selectedChatId && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium flex items-center justify-between">
                    <span className="truncate">{otherUser.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{formatTime(chat.sentAt)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {chat.senderId === currentUserId ? "You: " : ""}
                    {chat.text}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
        {visibleChats < sortedChats.length && (
          <div className="flex justify-center p-2">
            <Button onClick={handleLoadMore}>More</Button>
          </div>
        )}
      </div>
    </div>
  )
}

