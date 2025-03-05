"use client"

import { useState, useEffect } from "react"
import { ChatList } from "@/components/chat-list"
import { ChatWindow } from "@/components/chat-window"
import { NewChatForm } from "@/components/new-chat-form"
import { User } from "../../../../types/user"
import { Chat } from "../../../../types/chat"
import { Message } from "../../../../types/message"
import baseUrl from "@/constant/constant"
import { useSession } from "next-auth/react"

export interface ApiMessage {
  id: number
  senderId: number
  receiverId: number
  text: string
  sentAt: Date
  chatId?: number
}

export default function ChatApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<
    (Chat & {
      hasNewMessages?: boolean
      lastMessage?: Message
    })[]
  >([])
  const {data: session} = useSession()

  // Fetch current user and chats
  useEffect(() => {
    //  fetching the current user
    if (session?.user?.id && session?.user?.name) {
      const mockCurrentUser: User = {
        id: session.user.id,
        name: session.user.name,
      };

    setCurrentUser(mockCurrentUser)

    // Fetch chats for the current user
    const fetchChats = async () => {
      try {
        // In a real app, you would fetch this from your API
        const response = await fetch(`${baseUrl}usermessages/?userId=${mockCurrentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          setChats(data)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }

    fetchChats()

    // Set up polling for new messages
    const intervalId = setInterval(() => {
      if (mockCurrentUser.id) {
        fetchNewMessages(mockCurrentUser.id)
      }
    }, 3000) // Poll every 3 seconds

    // Listen for the markChatAsRead event
    const handleMarkChatAsRead = (event: CustomEvent) => {
      const { chatId } = event.detail
      setChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, hasNewMessages: false } : chat)))
    }

    window.addEventListener("markChatAsRead", handleMarkChatAsRead as EventListener)

    // Clean up the event listener
    return () => {
      clearInterval(intervalId)
      window.removeEventListener("markChatAsRead", handleMarkChatAsRead as EventListener)
    }
  }}, [session])

  // Function to fetch new messages
  const fetchNewMessages = async (userId: number) => {
    try {
      const response = await fetch(`${baseUrl}newmessages/?userId=${userId}`)
      if (response.ok) {
        const newMessages = await response.json()

        // Process new messages
        if (newMessages.length > 0) {
          // Update chats with new message indicators
          setChats((prevChats) => {
            const updatedChats = [...prevChats]

            // Group messages by chat
            const messagesByChatId = new Map()
            newMessages.forEach((message:ApiMessage) => {
              if (!messagesByChatId.has(message.chatId)) {
                messagesByChatId.set(message.chatId, [])
              }
              messagesByChatId.get(message.chatId).push(message)
            })

            // Update each chat with new messages
            messagesByChatId.forEach((messages, chatId) => {
              const chatIndex = updatedChats.findIndex((chat) => chat.id === chatId)
              if (chatIndex !== -1) {
                updatedChats[chatIndex] = {
                  ...updatedChats[chatIndex],
                  hasNewMessages: true,
                  lastMessage: messages[0], // Most recent message
                }
              }
            })

            return updatedChats
          })

          // If we have a selected chat, update its messages
          if (selectedChat) {
            const chatMessages = newMessages.filter((message:ApiMessage) => message.chatId === selectedChat.id)

            if (chatMessages.length > 0) {
              // Update the messages in the chat window
              // This will be handled by the ChatWindow component
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching new messages:", error)
    }
  }

  const handleChatCreated = (newChat: Chat) => {
    setChats((prev) => [...prev, newChat])
    setSelectedChat(newChat)
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Chats</h1>
          <p className="text-sm text-muted-foreground">Logged in as {currentUser.name}</p>
        </div>
        <div className="p-4 border-b border-border">
          <NewChatForm currentUserId={currentUser.id} onChatCreated={handleChatCreated} />
        </div>
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.id}
          onSelectChat={setSelectedChat}
          currentUserId={currentUser.id}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUserId={currentUser.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a chat or start a new conversation</h2>
              <p className="text-muted-foreground">Choose an existing chat from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

