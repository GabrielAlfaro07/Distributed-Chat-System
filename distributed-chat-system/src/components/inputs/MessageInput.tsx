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

  // Modify handleSend in MessageInput.tsx
  const handleSend = async () => {
    if (message.trim() && chatId && !isBlocked) {
      let fileUrl: string | null = null;
      let fileType: string | null = null;

      if (selectedFile) {
        try {
          // Determine subfolder based on MIME type
          let folder = "message-attachments";
          if (selectedFile.type.startsWith("image/")) folder = "images";
          else if (selectedFile.type.startsWith("video/")) folder = "videos";
          else if (selectedFile.type.includes("pdf")) folder = "documents";
          else folder = "files"; // Default for other file types

          // Upload to the specific subfolder
          const filePath = await uploadFile(selectedFile, folder);
          fileUrl = getFileURL(filePath);
          fileType = selectedFile.type;
        } catch (error) {
          console.error("File upload failed:", error);
          return;
        }
      }

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
  };

  return (
    <div className="relative p-4 bg-white border-t border-gray-200">
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
          className="flex-grow mr-2"
          disabled={isBlocked}
        />
        <AddDocumentButton onFileSelect={setSelectedFile} />
        <SendButton onClick={handleSend} isDisabled={isBlocked} />
      </div>
    </div>
  );
};

export default MessageInput;
