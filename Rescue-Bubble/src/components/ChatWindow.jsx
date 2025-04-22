import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5000"); // Make sure this matches your backend

const ChatWindow = () => {
  const { agencyId } = useParams();
  const userData = useSelector((state) => state.profile.accountInfo);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userData || !agencyId) return;

    // Load message history between the two users
    socket.emit("loadMessages", {
      sender: userData._id,
      receiver: agencyId,
    });

    socket.on("messageHistory", (loadedMessages) => {
      setMessages(loadedMessages);
    });

    socket.on("receiveMessage", (newMessage) => {
      if (
        (newMessage.sender === userData._id && newMessage.receiver === agencyId) ||
        (newMessage.receiver === userData._id && newMessage.sender === agencyId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("messageHistory");
      socket.off("receiveMessage");
    };
  }, [userData, agencyId]);

  const sendMessage = () => {
    if (inputMessage.trim() === "" || !userData || !agencyId) return;

    const messageData = {
      sender: userData._id,
      receiver: agencyId,
      message: inputMessage,
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", messageData);
    setInputMessage(""); // only reset input, do NOT add to messages state
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="h-[500px] border rounded-md p-4 overflow-y-auto bg-white shadow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-md max-w-[75%] ${
              msg.sender === userData._id
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded-md"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
