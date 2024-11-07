// ChatHeader.tsx
import React from "react";
import Title from "../titles/Title";
import ProfileButton from "../buttons/ProfileButton";

interface ChatHeaderProps {
  title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  return (
    <header className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
      <Title text={title} />
      <ProfileButton />
    </header>
  );
};

export default ChatHeader;
