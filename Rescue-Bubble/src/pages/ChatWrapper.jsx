import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatWindow from "../components/ChatWindow";

const ChatWrapper = () => {
  const { agencyId } = useParams();
  const currentUser = useSelector((state) => state.profile.user);

  // Log currentUser to check the data
  console.log("Current User in ChatWrapper:", currentUser);

  // Get sender and receiver IDs
  const senderId = currentUser?._id || "Unknown";
  const receiverId = agencyId;

  console.log("Sender:", senderId); // Log sender
  console.log("Receiver:", receiverId); // Log receiver

  return <ChatWindow sender={senderId} receiver={receiverId} />;
};

export default ChatWrapper;
