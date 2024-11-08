import React, { useState } from "react";
import TextAreaInput from "./TextAreaInput";
import SendButton from "../buttons/SendButton";
import { sendMessage } from "../../services/messageService";

interface MessageInputProps {
  chatId: string | null;
  senderId: string;
  onMessageSent: () => void; // Function to reload messages
  fileUrl?: string; // Optional file URL if the message includes a file
  fileType?: string; // Optional file type if the message includes a file
  selfDestructTime?: string; // Optional self-destruct time
  encryptionKey?: string; // Optional encryption key
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  senderId,
  onMessageSent,
  fileUrl,
  fileType,
  selfDestructTime,
  encryptionKey,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim() && chatId) {
      try {
        await sendMessage(
          chatId,
          senderId,
          message,
          fileUrl,
          fileType,
          selfDestructTime,
          encryptionKey
        );
        setMessage(""); // Clear input after sending
        onMessageSent(); // Reload messages
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex items-center">
      <TextAreaInput
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow mr-2"
      />
      <SendButton onClick={handleSend} />
    </div>
  );
};

export default MessageInput;
