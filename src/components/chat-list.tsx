import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Chat } from "../../types/chat";
import { Message } from "../../types/message";

interface ChatListProps {
  chats: (Chat & {
    hasNewMessages?: boolean;
    lastMessage?: Message;
  })[];
  selectedChatId?: number;
  onSelectChat: (chat: Chat) => void;
  currentUserId: number;
}

export function ChatList({ chats, selectedChatId, onSelectChat, currentUserId }: ChatListProps) {
  const [visibleChats, setVisibleChats] = useState(6);

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) return 0;
      return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
    });
  }, [chats]);

  const getOtherUserId = (chat: Chat) => {
    return chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    }

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(date, "EEE");
    }

    return format(date, "MMM d");
  };

  const handleLoadMore = () => {
    setVisibleChats((prev) => prev + 4);
  };

  if (sortedChats.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-muted-foreground text-center">No chats yet. Start a new conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-1 p-2">
        {sortedChats.slice(0, visibleChats).map((chat) => (
          <Button
            key={chat.id}
            variant={chat.id === selectedChatId ? "secondary" : "ghost"}
            className={cn("w-full justify-start px-3 py-2 h-auto", chat.id === selectedChatId && "bg-secondary")}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center w-full">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-xs font-medium">U{getOtherUserId(chat)}</span>
                </div>
                {chat.hasNewMessages && chat.id !== selectedChatId && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium flex items-center justify-between">
                  <span className="truncate">User {getOtherUserId(chat)}</span>
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatTime(chat.lastMessage.sentAt)}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <div className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage.senderId === currentUserId ? "You: " : ""}
                    {chat.lastMessage.text}
                  </div>
                )}
                {!chat.lastMessage && <div className="text-xs text-muted-foreground truncate">No messages yet</div>}
              </div>
            </div>
          </Button>
        ))}
        {visibleChats < sortedChats.length && (
          <div className="flex justify-center p-2">
            <Button onClick={handleLoadMore}>More</Button>
          </div>
        )}
      </div>
    </div>
  );
}