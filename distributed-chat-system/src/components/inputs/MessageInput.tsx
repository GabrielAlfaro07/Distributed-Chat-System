import React, { useState } from "react";
import TextAreaInput from "./TextAreaInput";
import SendButton from "../buttons/SendButton";
import AddDocumentButton from "../buttons/AddDocumentButton";
import { sendMessage } from "../../services/messageService";
import { getFileURL, uploadFile } from "../../services/fileService";

interface MessageInputProps {
  chatId: string | null;
  senderId: string;
  onMessageSent: () => void;
  selfDestructTime?: string;
  encryptionKey?: string;
  message: string;
  setMessage: (msg: string) => void;
  isBlocked: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  senderId,
  onMessageSent,
  selfDestructTime,
  encryptionKey,
  message,
  setMessage,
  isBlocked,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [botReply, setBotReply] = useState<string | null>(null);

  // Modify handleSend in MessageInput.tsx
  const handleSend = async () => {
    if (message.trim() && chatId && !isBlocked) {
      let fileUrl: string | null = null;
      let fileType: string | null = null;

      if (selectedFile) {
        try {
          let folder = "message-attachments";
          if (selectedFile.type.startsWith("image/")) folder = "images";
          else if (selectedFile.type.startsWith("video/")) folder = "videos";
          else if (selectedFile.type.includes("pdf")) folder = "documents";
          else folder = "files";

          const filePath = await uploadFile(selectedFile, folder);
          fileUrl = getFileURL(filePath);
          fileType = selectedFile.type;
        } catch (error) {
          console.error("File upload failed:", error);
          return;
        }
      }

      if (message.startsWith("!")) {
        // Send the command message
        try {
          await sendMessage(
            chatId,
            senderId, // Session user ID as sender
            message, // Command content
            fileUrl,
            fileType,
            selfDestructTime,
            encryptionKey
          );

          // Clear input and file after sending the command
          setMessage("");
          setSelectedFile(null);
          onMessageSent();

          // Now, send the command to the bot server
          const response = await fetch(
            "http://localhost:5174/receive-message",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Bot response:", data.reply);

            // Send the bot's reply as a new message in the chat
            await sendMessage(
              chatId,
              "c378b64c-6521-4c12-a9d1-356e5bfc1cba", // Bot's user ID
              data.reply, // Bot's response content
              null,
              null,
              selfDestructTime,
              encryptionKey
            );

            onMessageSent(); // Refresh messages after bot reply is sent
          } else {
            console.error("Error sending message to server:", response.status);
          }
        } catch (error) {
          console.error("Error connecting to bot server:", error);
        }
      } else {
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
          setMessage("");
          setSelectedFile(null);
          onMessageSent();
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      }
    }
  };

  return (
    <div className="relative p-4 bg-gray-800 border-t border-gray-900">
      {selectedFile && (
        <div className="absolute bottom-16 left-0 right-0 z-10 flex items-center gap-2 border p-2 rounded bg-gray-100 shadow-md m-2">
          {selectedFile.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected file preview"
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-xs text-red-500 underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        <TextAreaInput
          placeholder={
            isBlocked
              ? "You cannot send messages to this user"
              : "Type a message..."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 bg-gray-600 rounded pl-2 text-white"
          disabled={isBlocked}
        />
        <AddDocumentButton onFileSelect={setSelectedFile} />
        <SendButton onClick={handleSend} isDisabled={isBlocked} />
      </div>
    </div>
  );
};

export default MessageInput;
