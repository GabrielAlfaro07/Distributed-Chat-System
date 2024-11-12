// Message.tsx
import React, { useState, useEffect, useRef } from "react";
import { updateMessage, deleteMessage } from "../../services/messageService";
import { fetchUser, UserInfo } from "../../services/authService";
import { toast } from "react-toastify";
import MessageOptionsButton from "../buttons/MessageOptionsButton";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import EditingMessage from "./EditingMessage"; // Import EditingMessage component

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
        <img
          src={
            senderInfo.profile_picture_url ||
            "https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full mr-2 self-start"
        />
      )}

      <div
        className={`p-2 rounded w-2/3 ${
          isLeftAligned ? "bg-gray-300" : "bg-blue-500 text-white"
        } relative`}
      >
        {isLeftAligned && senderInfo && (
          <div className="text-sm font-semibold text-gray-700 mb-1">
            {senderInfo.username || "Unknown User"}
          </div>
        )}

        {isEditing ? (
          <EditingMessage
            initialContent={content}
            onSave={(newContent) => {
              updateMessage(id, newContent)
                .then(() => {
                  toast.success("Message updated successfully!");
                  onMessageUpdated();
                  setIsEditing(false);
                })
                .catch((error) => {
                  console.error("Failed to update message:", error);
                  toast.error("Failed to update message.");
                });
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex flex-col">
            {/* Message and timestamp row */}
            <div className="flex justify-between">
              <div className="pr-2">
                {getHighlightedText(content, searchQuery)}
              </div>
              {isLeftAligned && (
                <div className="text-xs mt-1 text-gray-500 ml-2 text-right">
                  {time}{" "}
                  {isEdited && <span className="italic ml-1">Edited</span>}
                </div>
              )}
            </div>
            {!isLeftAligned && (
              <div className="text-xs mt-1 text-right">
                {time} {isEdited && <span className="italic ml-1">Edited</span>}
              </div>
            )}
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
