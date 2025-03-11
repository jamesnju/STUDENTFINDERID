// Define the base Chat interface
export interface Chat {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt?: string;
}

// Extend Chat to include sender details
export interface ExtendedChat extends Chat {
  senderId: number;
  sender: {
    name: string;
  };
}


 
