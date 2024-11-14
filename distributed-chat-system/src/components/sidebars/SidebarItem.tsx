import React from "react";

interface SidebarItemProps {
  name: string;
  profilePictureUrl: string;
  lastMessage: string;
  onClick: () => void;
  selected: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  name,
  profilePictureUrl,
  lastMessage,
  onClick,
  selected,
}) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-2 cursor-pointer rounded-xl transition duration-200 ${
        selected ? "bg-blue-500" : "hover:bg-gray-600"
      }`}
    >
      <img
        src={profilePictureUrl}
        alt={name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex flex-col w-full pr-12">
        <span className="font-semibold text-white">{name}</span>
        <span className="text-gray-400 text-sm truncate">{lastMessage}</span>
      </div>
    </li>
  );
};

export default SidebarItem;
