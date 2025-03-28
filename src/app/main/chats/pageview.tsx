"use client";
import { useState, useEffect } from "react";
import { ChatList } from "@/components/chat-list";
import { ChatWindow } from "@/components/chat-window";
import { NewChatForm } from "@/components/new-chat-form";
import type { User } from "../../../../types/user";
import baseUrl from "@/constant/constant";
import { useSession } from "next-auth/react";
import { RevalidatePath } from "@/constant/RevalidateCustomPath";

// Define the ChatMessage interface to match what ChatList expects
export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  sentAt: string;
  chatId: number;
  sender: {
    name: string;
  };
  hasNewMessages?: boolean;
}
interface Payment {
  id: number;
  userId: number;
  amount: number;
  paymentMethod: "M-Pesa" | string;
  paymentStatus: "processing" | "completed" | "failed" | string;
  paymentDate: string; // ISO date string
  createdAt: string; // ISO date string
  transactionId: string;
  merchantRequestId: string | null;
  mpesaReceipt: string | null;
}

export default function ChatApp({ payments }: { payments: Payment[] }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatMessage | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const { data: session } = useSession();

  // Fetch current user and chats
  useEffect(() => {
    // fetching the current user
    if (session?.user?.id && session?.user?.name) {
      const mockCurrentUser: User = {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role, // Assuming role is available in the session
      };

      setCurrentUser(mockCurrentUser);

      // Fetch chats for the current user
      const fetchChats = async () => {
        try {
          // In a real app, you would fetch this from your API
          const response = await fetch(
            `${baseUrl}usermessages/?userId=${mockCurrentUser.id}`
          );
          if (response.ok) {
            const data = await response.json();
            // The data is already in the correct format (ChatMessage[])
            setChats(data);
            RevalidatePath("/main/chats");
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };

      fetchChats();

      // Set up polling for new messages
      const intervalId = setInterval(() => {
        if (mockCurrentUser.id) {
          fetchNewMessages(mockCurrentUser.id);
        }
      }, 3000); // Poll every 3 seconds

      // Listen for the markChatAsRead event
      const handleMarkChatAsRead = (event: CustomEvent) => {
        const { chatId } = event.detail;
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === chatId ? { ...chat, hasNewMessages: false } : chat
          )
        );
      };

      window.addEventListener(
        "markChatAsRead",
        handleMarkChatAsRead as EventListener
      );

      // Clean up the event listener
      return () => {
        clearInterval(intervalId);
        window.removeEventListener(
          "markChatAsRead",
          handleMarkChatAsRead as EventListener
        );
      };
    }
  }, [session]);

  // Function to fetch new messages
  const fetchNewMessages = async (userId: number) => {
    try {
      const response = await fetch(`${baseUrl}newmessages/?userId=${userId}`);
      if (response.ok) {
        const newMessages = await response.json();

        // Process new messages
        if (newMessages.length > 0) {
          // Update chats with new message indicators
          setChats((prevChats) => {
            const updatedChats = [...prevChats];

            // Group messages by chat
            const messagesByChatId = new Map();
            newMessages.forEach((message: ChatMessage) => {
              if (!messagesByChatId.has(message.chatId)) {
                messagesByChatId.set(message.chatId, []);
              }
              messagesByChatId.get(message.chatId).push(message);
            });

            // Update each chat with new messages
            messagesByChatId.forEach((messages, chatId) => {
              const chatIndex = updatedChats.findIndex(
                (chat) => chat.chatId === chatId
              );
              if (chatIndex !== -1) {
                updatedChats[chatIndex] = {
                  ...updatedChats[chatIndex],
                  hasNewMessages: true,
                  // No need for lastMessage property as we're using the message itself
                };
              }
            });

            return updatedChats;
          });

          // If we have a selected chat, update its messages
          if (selectedChat) {
            const chatMessages = newMessages.filter(
              (message: ChatMessage) => message.chatId === selectedChat.chatId
            );

            if (chatMessages.length > 0) {
              // Update the messages in the chat window
              // This will be handled by the ChatWindow component
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching new messages:", error);
    }
  };

  // Update the handleChatCreated function to work with ChatMessage
  const handleChatCreated = (newChat: any) => {
    // Convert the newChat to a ChatMessage format
    const chatMessage: ChatMessage = {
      id: newChat.id,
      chatId: newChat.id, // Assuming the chat ID is the same as the message ID for new chats
      senderId: currentUser?.id || 0,
      receiverId: newChat.receiverId || 0,
      text: newChat.text || "",
      sentAt: new Date().toISOString(),
      sender: {
        name: currentUser?.name || "",
      },
    };

    setChats((prev) => [...prev, chatMessage]);
    setSelectedChat(chatMessage);
  };

  // Check user role and payment status
  const userRole = session?.user?.role;
  const userReason = session?.user?.reason;
  const userId = session?.user?.id;
  const userPayment = payments.find((payment) => payment.userId === userId);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (
    userRole === "STUDENT" &&
    userReason === "LOSTID" &&
    userPayment?.paymentStatus !== "processing" &&
    userPayment?.paymentStatus !== "completed"
  ) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#FFEBEE", color: "#D32F2F" }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">Pay KSHS 1 to get access to the chat.</p>
          <a
            href="/main/payment"
            className="mt-6 inline-block bg-primary text-white py-2 px-4 rounded"
          >
            Go to Payment Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Chats</h1>
          <p className="text-sm text-muted-foreground">
            Logged in as {currentUser.name}
          </p>
        </div>
        <div className="p-4 border-b border-border">
          <NewChatForm
            currentUserId={currentUser.id}
            onChatCreated={handleChatCreated}
          />
        </div>
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.chatId}
          onSelectChat={(chat: ChatMessage) => setSelectedChat(chat)}
          currentUserId={currentUser.id}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} currentUserId={currentUser.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Select a chat or start a new conversation
              </h2>
              <p className="text-muted-foreground">
                Choose an existing chat from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
