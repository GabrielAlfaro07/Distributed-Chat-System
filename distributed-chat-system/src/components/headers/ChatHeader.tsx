// ChatHeader.tsx
import React, { useState } from "react";
import Title from "../titles/Title";
import DeleteChatButton from "../buttons/DeleteChatButton";
import DeleteChatModal from "../modals/DeleteChatModal";

interface ChatHeaderProps {
  title: string;
  onDeleteChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onDeleteChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteChat();
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
      <Title text={title} />
      {title != "Select a chat" && (
        <DeleteChatButton onClick={handleDeleteClick} />
      )}
      {isModalOpen && (
        <DeleteChatModal
          chatName={title}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </header>
  );
};

export default ChatHeader;
