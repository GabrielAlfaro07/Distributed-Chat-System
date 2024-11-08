import React from "react";

interface SidebarItemProps {
  name: string;
  profilePictureUrl: string;
  lastMessage: string;
  onClick: () => void;
  selected: boolean; // Add selected prop
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
      className={`flex items-center p-2 cursor-pointer rounded transition duration-200 ${
        selected ? "bg-blue-100" : "hover:bg-gray-200"
      }`} // Apply selected styling
    >
      <img
        src={profilePictureUrl}
        alt={name}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="flex flex-col w-full">
        <span className="font-semibold text-gray-900">{name}</span>
        <span className="text-gray-500 text-sm truncate max-w-full">
          {lastMessage}
        </span>
      </div>
    </li>
  );
};

export default SidebarItem;
