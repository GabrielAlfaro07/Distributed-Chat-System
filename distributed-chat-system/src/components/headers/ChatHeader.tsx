// src/components/headers/ChatHeader.tsx
import React, { useState } from "react";
import Title from "../titles/Title";
import DeleteChatButton from "../buttons/DeleteChatButton";
import DeleteChatModal from "../modals/DeleteChatModal";
import BlockUserButton from "../buttons/BlockUserButton";

interface ChatHeaderProps {
  title: string;
  onDeleteChat: () => void;
  sessionUserId: string;
  otherParticipantId: string;
  onSearch: (query: string) => void; // New prop for handling search
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onDeleteChat,
  sessionUserId,
  otherParticipantId,
  onSearch, // Destructure new prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
      <Title text={title} />
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
            onSearch(query); // Pass search query to parent
          }}
          className="border rounded pl-1"
        />
        <BlockUserButton
          sessionUserId={sessionUserId}
          otherParticipantId={otherParticipantId}
        />
        <DeleteChatButton onClick={() => setIsModalOpen(true)} />
        {isModalOpen && (
          <DeleteChatModal
            chatName={title}
            onConfirm={onDeleteChat}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
