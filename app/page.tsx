"use client"

import { useEffect, useState, ChangeEvent } from 'react'
import { io, Socket } from 'socket.io-client'

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null) // Socket instance or null
  const [inbox, setInbox] = useState<string[]>(["You can type your message below!"]) // Array of messages
  const [message, setMessage] = useState<string>("") // Current message input
  const [roomName, setRoomName] = useState<string>("") // Current room name

  const handleSendMessage = (): void => {
    if (socket) {
      socket.emit("message", message, roomName) // Send message
    }
  }

  const handleJoinRoom = (): void => {
    if (socket) {
      socket.emit("joinRoom", roomName) // Join room
    }
  }

  useEffect(() => {
    const socketInstance: Socket = io("http://localhost:4000") // Create socket instance
    socketInstance.on("message", (newMessage: string) => {
      setInbox((prev: string[]) => [...prev, newMessage]) // Add new message to inbox
    })
    setSocket(socketInstance) // Set socket instance in state

    return () => {// Clean up on unmount
      socketInstance.disconnect() // Disconnect socket on unmount
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-5 mt-20 px-10 lg:px-48">
        <div className="flex flex-col gap-2 border rounded-lg p-10">
          {inbox.map((currentMessage: string, index: number) => (
            <div key={index} className="border rounded px-4 py-2">
              {currentMessage}
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center justify-center">
          <input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setMessage(event.target.value)
            }}
            type="text"
            name="message"
            className="flex-1 bg-black border rounded px-2 py-1"
          />
          <button className="w-40" onClick={handleSendMessage}>Send message</button>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setRoomName(event.target.value)
            }}
            type="text"
            name="roomName"
            className="flex-1 bg-black border rounded px-2 py-1"
          />
          <button onClick={handleJoinRoom} className="w-40">Join Room</button>
        </div>
      </div>
    </div>
  );
}
