"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizontal } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (text: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      await onSendMessage(message.trim())
      setMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (message.trim()) {
        handleSubmit(e)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[60px] resize-none"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isSubmitting}
        className="h-[60px] w-[60px] flex-shrink-0"
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  )
}

