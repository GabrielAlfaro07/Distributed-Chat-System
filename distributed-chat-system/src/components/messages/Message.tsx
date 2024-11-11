// Message.tsx
import React, { useState } from "react";
import { updateMessage, deleteMessage } from "../../services/messageService";
import { toast } from "react-toastify";
import MessageOptionsButton from "../buttons/MessageOptionsButton";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

interface MessageProps {
  id: string;
  content: string;
  time: string;
  alignment: "left" | "right";
  isEdited: boolean;
  id_sender: string; // ID of the message sender
  session_user_id: string; // ID of the current session user
  onMessageUpdated: () => void; // Function to refresh messages after an update or delete
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = async () => {
    try {
      await updateMessage(id, editedContent);
      toast.success("Message updated successfully!");
      setIsEditing(false);
      onMessageUpdated(); // Refresh messages after editing
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(id);
      toast.success("Message deleted successfully!");
      onMessageUpdated(); // Refresh messages after deleting
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message.");
    }
  };

  const isLeftAligned = alignment === "left";

  return (
    <div className={`mb-4 flex ${isLeftAligned ? "" : "justify-end"}`}>
      <div
        className={`p-2 rounded w-2/3 ${
          isLeftAligned ? "bg-gray-300" : "bg-blue-500 text-white"
        } relative`}
      >
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="p-1 border rounded w-full text-black"
            />
            <button onClick={handleEdit} className="text-black mt-2">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-500 mt-2 ml-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div>{content}</div>
            <div className="text-xs mt-1 text-right">
              {time}{" "}
              {isEdited && (
                <span className="italic text-gray-500 ml-1">Edited</span>
              )}
            </div>
          </>
        )}

        {/* Conditionally render options button in the top right corner */}
        {id_sender === session_user_id && (
          <div className="absolute top-1 right-1">
            <MessageOptionsButton
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          </div>
        )}

        {/* Delete confirmation modal */}
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
