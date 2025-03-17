import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Message } from "../../types/message"

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        <div className="text-sm">{message.text}</div>
        <div
          className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-secondary-foreground/70")}
        >
          {format(new Date(message.sentAt), "h:mm a")}
        </div>
      </div>
    </div>
  )
}

