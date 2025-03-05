"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

const ChatForm = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
console.log(session, "sesion")
  useEffect(() => {
    if (!session) return;

    // Join the chat room using user's ID
    socket.emit("join", session?.user?.id);

    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [session]);

  const sendMessage = () => {
    if (!message.trim() || !session) return;

    const newMessage = {
      sender: session.user.name,
      text: message,
    };

    // Emit the message to the server
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  if (!session) {
    return <p>Please log in to chat.</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg mt-10 bg-white">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      {/* Chat history */}
      <div className="h-64 overflow-y-auto border p-2 mb-4 rounded-lg">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border p-2 rounded-l-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 rounded-r-lg hover:bg-secondary"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatForm;
