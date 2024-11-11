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
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onDeleteChat,
  sessionUserId,
  otherParticipantId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
      <Title text={title} />
      <div className="flex space-x-2">
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
