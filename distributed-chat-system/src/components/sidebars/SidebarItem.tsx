// SidebarItem.tsx
import React from "react";

interface SidebarItemProps {
  name: string;
  profilePictureUrl: string;
  lastMessage: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  profilePictureUrl,
  lastMessage,
}) => {
  return (
    <li className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded">
      <img
        src={profilePictureUrl}
        alt={name}
        className="w-8 h-8 rounded-full mr-3"
      />
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-gray-500 text-sm truncate">{lastMessage}</span>
      </div>
    </li>
  );
};

export default SidebarItem;
