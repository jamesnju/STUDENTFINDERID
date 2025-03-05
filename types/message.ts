export interface Message {
  id: number
  chatId: number
  senderId: number
  receiverId: number
  text: string
  sentAt: string
  sender?: {
    id: number
    name: string
  }
  receiver?: {
    id: number
    name: string
  }
}

