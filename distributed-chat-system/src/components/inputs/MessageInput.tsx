import React from "react";
import TextAreaInput from "./TextAreaInput";
import SendButton from "../buttons/SendButton";
import { sendMessage } from "../../services/messageService";

interface MessageInputProps {
  chatId: string | null;
  senderId: string;
  onMessageSent: () => void;
  fileUrl?: string;
  fileType?: string;
  selfDestructTime?: string;
  encryptionKey?: string;
  message: string;
  setMessage: (msg: string) => void;
  isBlocked: boolean; // New prop for blocked status
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  senderId,
  onMessageSent,
  fileUrl,
  fileType,
  selfDestructTime,
  encryptionKey,
  message,
  setMessage,
  isBlocked,
}) => {
  const handleSend = async () => {
    if (message.trim() && chatId && !isBlocked) {
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
        placeholder={
          isBlocked
            ? "You cannot send messages to this user"
            : "Type a message..."
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow mr-2"
        disabled={isBlocked} // Disable text input if blocked
      />
      <SendButton onClick={handleSend} isDisabled={isBlocked} />{" "}
      {/* Disable send button */}
    </div>
  );
};

export default MessageInput;
