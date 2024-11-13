// Message.tsx
import React, { useState, useEffect, useRef } from "react";
import { updateMessage, deleteMessage } from "../../services/messageService";
import { fetchUser, UserInfo } from "../../services/authService";
import { toast } from "react-toastify";
import MessageOptionsButton from "../buttons/MessageOptionsButton";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import EditingMessage from "./EditingMessage"; // Import EditingMessage component
import ProfilePicture from "../helpers/ProfilePicture";
import SenderName from "../helpers/SenderName";
import Timestamp from "../helpers/Timestamp";

interface MessageProps {
  id: string;
  content: string;
  time: string;
  alignment: "left" | "right";
  isEdited: boolean;
  id_sender: string;
  session_user_id: string;
  onMessageUpdated: () => void;
  searchQuery: string;
  fileUrl?: string;
  fileType?: string;
}

const Message: React.FC<MessageProps> = ({
  id,
  content,
  time,
  alignment,
  isEdited,
  id_sender,
  session_user_id,
  onMessageUpdated,
  searchQuery,
  fileUrl,
  fileType,
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [senderInfo, setSenderInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchSenderInfo = async () => {
      const userInfo = await fetchUser(id_sender);
      setSenderInfo(userInfo);
    };

    fetchSenderInfo();
  }, [id_sender]);

  // Function to render file previews
  const renderFilePreview = () => {
    if (!fileUrl || !fileType) return null; // Ensure both fileUrl and fileType are defined
    console.log(fileUrl, fileType);
    // Handle image preview
    if (fileType.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt="Uploaded image"
          className="max-w-xs rounded my-2"
        />
      );
    }

    // Handle video preview
    if (fileType.startsWith("video/")) {
      return (
        <video controls className="max-w-xs rounded my-2">
          <source src={fileUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Handle document or other file types with specific file descriptions
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline my-2"
      >
        Download {fileType.includes("pdf") ? "PDF Document" : "File"}
      </a>
    );
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(id);
      toast.success("Message deleted successfully!");
      onMessageUpdated();
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message.");
    }
  };

  // Highlight matching content
  const getHighlightedText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleSaveMessage = async (newContent: string) => {
    try {
      await updateMessage(id, newContent);
      toast.success("Message updated successfully!");
      onMessageUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message.");
    }
  };

  // Scroll to message if it matches the search query
  useEffect(() => {
    if (searchQuery && content.includes(searchQuery)) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchQuery, content]);

  const isLeftAligned = alignment === "left";

  return (
    <div
      ref={messageRef}
      className={`mb-4 flex ${isLeftAligned ? "" : "justify-end"}`}
    >
      {isLeftAligned && senderInfo && (
        <ProfilePicture url={senderInfo.profile_picture_url} />
      )}

      <div
        className={`p-2 rounded w-2/3 ${
          isLeftAligned ? "bg-gray-300" : "bg-blue-500 text-white"
        } relative`}
      >
        {/* Sender Info */}
        {isLeftAligned && senderInfo && (
          <SenderName name={senderInfo.username} />
        )}

        {/* Message Content */}
        {isEditing ? (
          <EditingMessage
            initialContent={content}
            onSave={(newContent) => handleSaveMessage(newContent)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col">
            {/* Render file preview if present */}
            {renderFilePreview()}

            {/* Message and timestamp row */}
            <div className="flex justify-between">
              <div className="pr-2">
                {getHighlightedText(content, searchQuery)}
              </div>
              <Timestamp
                time={time}
                isEdited={isEdited}
                alignment={alignment}
              />
            </div>
          </div>
        )}

        {id_sender === session_user_id && (
          <div className="absolute top-1 right-1">
            <MessageOptionsButton
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          </div>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={() => {
              handleDelete();
              setShowDeleteModal(false);
            }}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
