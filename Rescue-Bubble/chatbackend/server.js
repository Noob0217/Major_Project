import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// Connect to backend
const socket = io('http://localhost:5000'); // Change if backend is hosted elsewhere

const ChatWindow = () => {
  const { agencyId } = useParams();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Receive messages
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const data = { agencyId, message };
    socket.emit('sendMessage', data);
    setChat((prevChat) => [...prevChat, data]);
    setMessage('');
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <div className="p-4 bg-indigo-600 text-white text-xl font-semibold">
        Chat with Agency: {agencyId}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chat.map((msg, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded shadow w-fit max-w-xs"
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="p-4 flex items-center gap-2 border-t bg-white">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
